import psycopg2
from functions.database import Database


class Query:
    def __init__(self):
        self.database = Database()

    def _execute_query(self, query, data):
        database = Database()

        try:
            result = database.selectOne(query, data)
            
            return result
        finally:
            pass
    
    def fetch_country(self):
        database = Database()

        query = """
        SELECT DISTINCT unnest(xpath('//AirportCode/Countries/Country/@iso_country', xml))::text as country
        FROM imported_documents
        ORDER BY iso_country
        """

        results = database.selectAll(query)
        database.disconnect()

        formatted_country = [country[0] for country in results]


        return formatted_country
    
    @staticmethod
    def fetch_region_by_country(iso_country):
        database = Database()
        
        query =  """
        SELECT
            xpath('//Region/@iso_region', country)::text AS iso_region,
            xpath('//Region/@municipality', country)::text AS municipality,
            xpath('//Region/@gps_code', country)::text AS gps_code,
            xpath('//Region/@local_code', country)::text AS local_code,
        FROM
            imported_documents,
            unnest(xpath('//Country[@iso_country="{}"]/Regions/Region', xml)) AS country
        WHERE
            xpath('//Country[@iso_country="{}"]', xml) IS NOT NULL
        ORDER BY
            iso_region;
        """.format(iso_country, iso_country)

        results = database.selectAll(query)
        database.disconnect()
        
        formatted_region = [
            {
                "iso_region": region[0],
                "municipality": region[1],
                "gps_code": region[2],
                "local_code": region[3],
            } for region in results
        ]
        
        return formatted_region
    
    @staticmethod
    def fetch_airport_by_region(iso_region):
        database = Database()

        query =  """
        SELECT
            xpath('//Airport/@ident', region)::text AS ident,
            xpath('//Airport/@type', region)::text AS type,
            xpath('//Airport/@name', region)::text AS name,
            xpath('//Airport/@elevation_ft', region)::text AS elevation_ft,
            xpath('//Airport/@iata_code', region)::text AS iata_code,
            xpath('//Airport/@coordinates', region)::text AS coordinates,
        FROM
            imported_documents,
            unnest(xpath('//Region[@iso_region="{}"]/Aiports/Airport', xml)) AS region
        WHERE
            xpath('//Region[@iso_region="{}"]', xml) IS NOT NULL
        ORDER BY
            name;
        """.format(iso_region, iso_region)

        results = database.selectAll(query)
        database.disconnect()
        
        formatted_airport = [
            {
                "ident": airport[0],
                "type": airport[1],
                "name": airport[2],
                "elevation_ft": airport[3],
                "iata_code": airport[4],
                "coordinates": airport[5],
            } for airport in results
        ]
        
        return formatted_airport
    
    @staticmethod
    def fetch_airport_highest():
        database = Database()

        query = """
        SELECT
            xpath('//Airport/@ident')::text AS ident,
            xpath('//Airport/@type')::text AS type,
            xpath('//Airport/@name')::text AS name,
            xpath('//Airport/@elevation_ft')::text AS elevation_ft,
            xpath('//Airport/@iata_code')::text AS iata_code,
            xpath('//Airport/@coordinates')::text AS coordinates
        FROM
            imported_documents
        ORDER BY
            elevation_ft::numeric ASC;
        """

        results = database.selectAll(query)
        database.disconnect()

        formatted_airport = [
            {
                "ident": airport[0],
                "type": airport[1],
                "name": airport[2],
                "elevation_ft": airport[3],
                "iata_code": airport[4],
                "coordinates": airport[5],
            } for airport in results
        ]

        return formatted_airport

    @staticmethod
    def fetch_airport_lowest():
        database = Database()

        query = """
        SELECT
            xpath('//Airport/@ident')::text AS ident,
            xpath('//Airport/@type')::text AS type,
            xpath('//Airport/@name')::text AS name,
            xpath('//Airport/@elevation_ft')::text AS elevation_ft,
            xpath('//Airport/@iata_code')::text AS iata_code,
            xpath('//Airport/@coordinates')::text AS coordinates
        FROM
            imported_documents
        ORDER BY
            elevation_ft::numeric DESC;
        """

        results = database.selectAll(query)
        database.disconnect()

        formatted_airport = [
            {
                "ident": airport[0],
                "type": airport[1],
                "name": airport[2],
                "elevation_ft": airport[3],
                "iata_code": airport[4],
                "coordinates": airport[5],
            } for airport in results
        ]

        return formatted_airport

    
