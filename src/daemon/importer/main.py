import asyncio
import time
import uuid
import hashlib
import xml.etree.ElementTree as ET
from dotenv import dotenv_values
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent
from utils.database import Database

from utils.to_xml_converter import CSVtoXMLConverter

# Load configuration from the .env file
config = dotenv_values(".env")

# Number of XML parts to split the conversion into
NUM_XML_PARTS = int(config.get("NUM_XML_PARTS", 10))

# Function to get a list of CSV files in the input folder
def get_csv_files_in_input_folder():
    return [os.path.join(dp, f) for dp, dn, filenames in os.walk(CSV_INPUT_PATH) for f in filenames if
            os.path.splitext(f)[1] == '.csv']

# Function to generate a unique file name for XML output
def generate_unique_file_name(directory):
    return f"{directory}/{str(uuid.uuid4())}.xml"

# Function to convert CSV to XML and split into multiple parts
def convert_csv_to_xml(in_path, out_folder, NUM_XML_PARTS):
    converter = CSVtoXMLConverter(in_path)
    root = converter.to_xml()

    # Find the AirportCode element
    airport_code_el = root.find(".//AirportCode")

    xml_info_list = []

    # Ensure the output folder exists
    os.makedirs(out_folder, exist_ok=True)

    for i in range(NUM_XML_PARTS):
        # Create a new root element for each chunk
        chunk_root = ET.Element("AirportCode")

        if airport_code_el is not None:
            # Copy the attributes from AirportCode element
            for attribute in airport_code_el.attrib:
                chunk_root.set(attribute, airport_code_el.get(attribute))

            # Create a new Countries element for each chunk
            chunk_countries_el = ET.Element("Countries")
            countries_el = airport_code_el.find(".//Countries")

            if countries_el is not None:
                for country_el in countries_el.findall(".//Country"):
                    # Create a new Country element for each chunk
                    chunk_country_el = ET.Element("Country", attrib=country_el.attrib)
                    regions_el = country_el.find(".//Regions")

                    if regions_el is not None:
                        # Create a new Regions element for each chunk
                        chunk_regions_el = ET.Element("Regions")
                        for region_el in regions_el.findall(".//Region"):
                            # Create a new Region element for each chunk
                            chunk_region_el = ET.Element("Region", attrib=region_el.attrib)
                            airports_el = region_el.find(".//Airports")

                            if airports_el is not None:
                                # Create a new Airports element for each chunk
                                chunk_airports_el = ET.Element("Airports")
                                for airport_el in airports_el.findall(".//Airport"):
                                    # Create a new Airport element for each chunk
                                    chunk_airport_el = ET.Element("Airport", attrib=airport_el.attrib)
                                    chunk_airports_el.append(chunk_airport_el)

                                # Append the chunk Airports element to the chunk Region element
                                chunk_region_el.append(chunk_airports_el)

                            # Append the chunk Region element to the chunk Regions element
                            chunk_regions_el.append(chunk_region_el)

                        # Append the chunk Regions element to the chunk Country element
                        chunk_country_el.append(chunk_regions_el)

                    # Append the chunk Country element to the chunk Countries element
                    chunk_countries_el.append(chunk_country_el)

            # Append the chunk Countries element to the chunk root
            chunk_root.append(chunk_countries_el)

        # Create a new XML tree with the chunk_root
        chunk_tree = ET.ElementTree(chunk_root)

        file_identifier = str(uuid.uuid4())

        # Save the chunk to a new XML file
        chunk_out_path = os.path.join(out_folder, f"{file_identifier}_part_{i + 1}.xml")
        with open(chunk_out_path, "wb") as chunk_file:
            chunk_tree.write(chunk_file, encoding="utf-8", xml_declaration=True)

        print(f"Part {i + 1} saved to {chunk_out_path}")

        # Get the XML content as a string
        xml_content = ET.tostring(chunk_root, encoding="utf-8", method="xml").decode()

        # Append XML information to the list
        xml_info_list.append((f"{file_identifier}_part_{i + 1}.xml", xml_content))

    return xml_info_list

# Class for handling CSV file events
class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path):
        self._output_path = output_path
        self._input_path = input_path

         # Trigger the conversion for existing CSV files
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(CSV_INPUT_PATH, file))
            event.event_type = "created"
            self.dispatch(event)

     # Async function to convert CSV to XML
    async def convert_csv(self, csv_path):
         # Check if the file has already been converted
        if csv_path in await self.get_converted_files():
            return

        print(f"Novo Ficheiro a Converter: '{csv_path}'")

        # Read CSV file content
        with open(csv_path, 'rb') as csv_file:
            csv_content = csv_file.read()
        
        content_hash = self.get_file_hash(csv_content)

        # Check if the content has already been converted
        if content_hash in await self.get_converted_files():
            print(f"Ficheiro: '{csv_path}' Já foi Convertido")
            return

        # Generate a unique XML file path
        xml_path = generate_unique_file_name(self._output_path)

        # Insert information into the database
        database = Database()
        insert_query = "INSERT INTO public.converted_documents (src, file_size, dst, csv_content, content_hash) VALUES (%s, %s, %s, %s, %s)"
        data = (csv_path, len(csv_content), xml_path, csv_content, content_hash)
        database.insert(insert_query, data)
        print(f"Ficheiro: '{csv_path}' Inserção Tabela(converted_documents)")

        # Perform CSV to XML conversion
        converter = CSVtoXMLConverter(csv_path)
        xml_info_list = convert_csv_to_xml(csv_path, xml_path, NUM_XML_PARTS)
        
        # Insert XML information into the database
        insert_query = "INSERT INTO public.imported_documents (file_name, xml) VALUES (%s, %s)"
        data_list = [(file_name, xml_content) for file_name, xml_content in xml_info_list]
        database.insert_many(insert_query, data_list)
        print(f"Ficheiros Inserção Tabela(imported_documents)")

    # Async function to get the list of converted files from the database
    async def get_converted_files(self):
        database = Database()
        select_query = "SELECT DISTINCT content_hash FROM public.converted_documents"
        result = database.select(select_query)

        return [record[0] for record in result]

    # Function to calculate the hash of file content
    def get_file_hash(self, file_content):
        sha256 = hashlib.sha256()
        sha256.update(file_content)
        return sha256.hexdigest()

    # Event handler for file creation
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))


if __name__ == "__main__":
    # Define input and output paths
    CSV_INPUT_PATH = "/csv"
    XML_OUTPUT_PATH = "/xml"

    # Create the file observer
    observer = Observer()
    observer.schedule(
        CSVHandler(CSV_INPUT_PATH, XML_OUTPUT_PATH),
        path=CSV_INPUT_PATH,
        recursive=True)
    observer.start()

    # Keep the script running until interrupted
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

#
# This Python script monitors a specified CSV input folder using the Watchdog library. 
# Upon detecting a new CSV file, it converts the CSV data into XML format and splits it into multiple parts. 
# The converted XML data is stored in a database, and the script uses asynchronous operations with asyncio. 
# The conversion process is encapsulated in classes and functions for modularity and readability.