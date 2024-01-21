import asyncio
import os
import time
import uuid

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent

from utils.to_xml_converter import CSVtoXMLConverter
from utils.database import Database

# Caminhos para introduzir ficheiros CSV e sair ficheiros XML
CSV_INPUT_PATH = "/csv"
XML_OUTPUT_PATH = "/xml"


def get_csv_files_in_input_folder():
    # Obter lista de todos os ficheiros CSV
    return [os.path.join(dp, f) for dp, dn, filenames in os.walk(CSV_INPUT_PATH) for f in filenames if
            os.path.splitext(f)[1] == '.csv']


def generate_unique_file_name(directory):
    # Gerar um nome de ficheiro unico para o ficheiro XML usando UUID
    return f"{directory}/{str(uuid.uuid4())}.xml"


def convert_csv_to_xml(in_path, out_path):
    # Converter o ficheiro CSV para XML usando o Converter
    converter = CSVtoXMLConverter(in_path)
    xml_content = converter.to_xml_str()

    # Escrever no ficheiro XML
    with open(out_path, "w") as file:
        file.write(xml_content)

    # Retornar a o nome do XML gerado
    return os.path.basename(out_path)


def import_doc(file_name, xml):
    # Inserir informação sobre o documento convertidopara a db
    database = Database()
    database.insert(
        "INSERT INTO imported_documents (file_name, xml) VALUES (%s, %s)", (file_name, xml))


def convert_doc(src, dst, filesize):
    # Verificar se o ficheiro CSV já foi convertido
    database = Database()
    database.insert(
        "INSERT INTO converted_documents(src, dst, file_size) VALUES (%s, %s, %s)", (src, dst, filesize))


class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path):
        self._output_path = output_path
        self._input_path = input_path

        # Gerar o nome de ficheiro único para o ficheiro XML
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(CSV_INPUT_PATH, file))
            event.event_type = "created"
            self.dispatch(event)

    async def convert_csv(self, path_csv):
        # Verificar se o ficheiro CSV já foi convertido
        if path_csv in await self.get_converted_files():
            return

        print(f"New file to convert: '{path_csv}'")

        # Geurar o nome de ficheiro único para o ficheiro XML
        path_xml = generate_unique_file_name(self._output_path)

        try:
            # Converter CSV para XML para suportar operações na db
            xml_file_name = convert_csv_to_xml(path_csv, path_xml)
            convert_doc(src=path_csv, dst=path_xml, filesize=os.stat(path_xml).st_size)

            with open(path_xml, 'r', encoding='utf-8') as xml_file:
                xml_content = xml_file.read()

            import_doc(file_name=xml_file_name, xml=xml_content)

            print(f"XML file was generated: '{path_xml}'")
        except Exception as e:
            # Remove o ficheiro caso haja erro
            print(f"Error processing {path_csv}: {str(e)}")
            os.remove(path_xml)

    async def get_converted_files(self):
        # Obtem lista de ficheiros convertidos na db
        files = []
        database = Database()
        for file in database.selectAll("SELECT src FROM converted_documents"):
            files.append(file[0])

        return files

    def on_created(self, event):
        # Verifica se o evento corresponde ao novo ficheiro CSV criado
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))


if __name__ == "__main__":
    observer = Observer()
    observer.schedule(
        CSVHandler(CSV_INPUT_PATH, XML_OUTPUT_PATH),
        path=CSV_INPUT_PATH,
        recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()
