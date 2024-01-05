import xml.etree.ElementTree as ET
from entities.region import Region

class Country:
    def __init__(self, continent, iso_country):
        Country.counter += 1
        self._id = Country.counter
        self._continent = continent
        self._iso_country = iso_country
        self._regions = []

    def add_region(self, region: Region):
        self._regions.append(region)

    def to_xml(self):
        el = ET.Element("Country")
        el.set("id", str(self._id))
        el.set("iso_country", self._iso_country)
        el.set("continent", self._continent)

        regions_el = ET.Element("Regions")

        for region in self._regions:
            regions_el.append(region.to_xml())


        el.append(regions_el)

        return el
    
    def get_id(self):
        return self._id
    
    def __str__(self):
        return f"id: {self._id}, continent:{self._continent}, iso_country:{self._iso_country}"
    
    

Country.counter = 0
