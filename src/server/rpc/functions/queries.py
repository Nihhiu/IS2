from lxml import etree
import psycopg2
from database.database import Database


class Query:
    def __init__(self):
        self.database = Database()

    def _execute_query(self, query, data):
        database = Database()
        try:
            result = database.selectOne(query, data)
            return result
        finally:
            database.disconnect()
    
    def fetch_country(self):
        database = Database()

        query = """
        SELECT DISTINCT unnest(xpath('//AirportCode/Countries/Country/@iso_country', xml))::text as country
        FROM imported_documents
        ORDER BY iso_country
        """

        results = database.selectAll(query)
        database.disconnect()

        formatted_country = [f"|- {country[0]}" for country in results]

        return formatted_country
    
    @staticmethod
    def fetch_region_by_country(iso_country):
        database = Database()
        query = """
        SELECT DISTINCT unnest(xpath('//Countries/Country[@name="{}"]/Regions/Region/@iso_region', xml))::text AS region
        FROM imported_documents
        """.format(iso_country)

        results = database.selectAll(query)
        formatted_regions = [region[0] for region in results]

        return formatted_regions
