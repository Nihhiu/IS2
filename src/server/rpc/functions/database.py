import psycopg2

def db_connect():
    connection = psycopg2.connect(user="is",
                                  password="is",
                                  host="db-xml",
                                  database="is")
    return connection

def cursor_connect(connection):
    cursor = connection.cursor()

    return cursor

def fetch_countries():
    try:
        connection = db_connect()

        cursor = cursor_connect(connection)

        cursor.execute("""
        SELECT DISTINCT unnest(xpath('//Countries/Country/@iso_country', xml))::text as iso_country
        FROM imported_documents
        ORDER BY iso_country;
        """)

        results = cursor.fetchall()

        if connection:
            cursor.close()
            connection.close()

            return results
        
    except (Exception, psycopg2.Error) as error:
        print("Failed to fetch data", error)

def fetch_regions():
    try:
        connection = db_connect()

        cursor = cursor_connect(connection)

        cursor.execute("""
        SELECT DISTINCT unnest(xpath('//Regions/Region/@iso_region', xml))::text as iso_region
        FROM imported_documents
        ORDER BY iso_region;
        """)

        results = cursor.fetchall()

        if connection:
            cursor.close()
            connection.close()

            return results
        
    except (Exception, psycopg2.Error) as error:
        print("Failed to fetch data", error)

def fetch_airports():
    try:
        connection = db_connect()

        cursor = cursor_connect(connection)

        cursor.execute("""
        SELECT DISTINCT unnest(xpath('//Airports/Airport/@ident', xml))::text as ident
        FROM imported_documents
        ORDER BY ident;
        """)

        results = cursor.fetchall()

        if connection:
            cursor.close()
            connection.close()

            return results
        
    except (Exception, psycopg2.Error) as error:
        print("Failed to fetch data", error)