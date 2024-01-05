import xml.etree.ElementTree as ET
from entities.airport import Airport

class Region:

    def __init__(self, iso_region, municipality, gps_code, local_code):
        Region.counter += 1
        self._id = Region.counter
        self._iso_region = iso_region
        self._municipality = municipality
        self._gps_code = gps_code
        self._local_code = local_code
        self._airports = []

    def add_airport(self, airport: Airport):
        self._airports.append(airport)

    def to_xml(self):
        el = ET.Element("Region")
        el.set("id", str(self._id))
        el.set("iso_region", self._iso_region)
        el.set("municipality", self._municipality)
        el.set("gps_code", self._gps_code)
        el.set("local_code", self._local_code)

        airports_el = ET.Element("Airports")
        for airport in self._airports:
            airports_el.append(airport.to_xml())

        el.append(airports_el)

        return el

    def get_id(self):
        return self._id

    def __str__(self):
        return f"id:{self._id}, iso_region: {self._iso_region}, municipality: {self._municipality}, gps_code: {self._gps_code}, local_code: {self._local_code}"
    
    
Region.counter = 0
