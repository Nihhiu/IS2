
import csv
import xml.dom.minidom as md
import xml.etree.ElementTree as ET

from csv_reader import CSVReader
from entities.country import Country
from entities.region import Region
from entities.airport import Airport

class CSVtoXMLConverter:

    def __init__(self, path):
        self._reader = CSVReader(path)

    def to_xml(self):
        """
        This method reads the CSV file and converts it into an XML structure.
        """

        # read countries
        countries = self._reader.read_entities(
            attr="iso_country",
            builder=lambda row: Country(row["continent"], row["iso_country"])
        )

        # read regions
        def after_creating_region(region, row):
            """
            This function is called after creating a region. It adds the region to the appropriate country.
            """
            countries[row["iso_country"]].add_region(region)

        regions = self._reader.read_entities(
            attr = "iso_region",
            builder=lambda row: Region(
                municipality = row["municipality"],
                iso_region = row["iso_region"],
                gps_code = row["gps_code"],
                local_code = row["local_code"]
            ),
            after_create=after_creating_region
        )

        # read airport
        def after_creating_airport(airport, row):
            """
            This function is called after creating an airport. It adds the airport to the appropriate region.
            """
            regions[row["iso_region"]].add_airport(airport)

        self._reader.read_entities(
            attr="ident",
            builder=lambda row: Airport(
                name=row["name"],
                ident=row["ident"],
                type=row["type"],
                elevation_ft=row["elevation_ft"],
                iata_code=row["iata_code"],
                coordinates=row["coordinates"],
            ),
            after_create=after_creating_airport
        )

        # generate the final XML structure
        root_el = ET.Element("AirportCode")

        countries_el = ET.Element("Countries")

        for country in countries.values():
            countries_el.append(country.to_xml())

        root_el.append(countries_el)
        return root_el

    def to_xml_str(self):
        """
        This method converts the XML structure into a string.
        """
        xml_str = ET.tostring(self.to_xml(), encoding='utf8', method='xml').decode()
        dom = md.parseString(xml_str)
        pretty_xml_str = dom.toprettyxml()

        with open("/data/xml.xml", 'w', encoding='utf-8') as xml_file:
            xml_file.write(dom.toprettyxml(indent='\t'))

        return dom.toprettyxml()
#
#This code converts a CSV file into an XML file. It reads the CSV file using the `CSVReader` class and creates the corresponding entities (Country, Region, and Airport) using the provided builders. After creating each entity, it adds it to the appropriate parent entity. Finally, it generates the XML structure and converts it into a string..</s>