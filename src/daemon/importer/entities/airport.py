import xml.etree.ElementTree as ET

class Airport:

    def __init__(self, ident, type, name, elevation_ft, iata_code, coordinates):
        Airport.counter += 1
        self._id = Airport.counter
        self._ident = ident
        self._type = type
        self._name = name
        self._elevation_ft = elevation_ft
        self._iata_code = iata_code
        self._coordinates = coordinates
        
    def to_xml(self):
        el = ET.Element("Airport")
        el.set("id", str(self._id))
        el.set("ident", self._ident)
        el.set("type", self._type)
        el.set("name", self._name)
        el.set("elevation_ft", self._elevation_ft)
        el.set("iata_code", self._iata_code)
        el.set("coordinates", self._coordinates)
        return el

    def get_id(self):
        return self._id
    
    def __str__(self):
        return f"id:{self._id}, ident: {self._ident}, type: {self._type}, name: {self._name}, elevation_ft: {self._elevation_ft}, iata_code: {self._iata_code}, coordinates: {self._coordinates}"
        
Airport.counter = 0
