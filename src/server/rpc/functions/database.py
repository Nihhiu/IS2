import psycopg2

class Database:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.user = "is"
        self.password = "is"
        self.host = "is-db"
        self.port = "5432"
        self.database = "is"

    #Connect to the database
    def connect(self):
        if self.connection is None:
            try:
                self.connection = psycopg2.connect(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    database=self.database
                )
                self.cursor = self.connection.cursor()
                print("\nConectada á BD")
            except psycopg2.Error as error:
                print(f"\nError: {error}")

    #Disconnect from the database
    def disconnect(self):
        if self.connection:
            try:
                self.cursor.close()
                self.connection.close()
                print("\nDesconectada á BD")
            except psycopg2.Error as e:
                print(f"\nErro: {e}")

    #Execute the insert SQL query with the given data
    def insert(self, sql_query, data):
        self.connect()
        try:
            self.cursor.execute(sql_query, data)
            self.connection.commit()
            print("\nA query foi bem executada.")
        except psycopg2.Error as error:
            print(f"\nError: {error}")

    #Execute the select SQL query with the given data and fetch all rows
    def selectAll(self, query, data=None):
        self.connect()
        with self.cursor as cursor:
            if data is None:
                cursor.execute(query)
            else:
                cursor.execute(query, data)
            result = [row for row in cursor.fetchall()]
        return result

    #Execute the select SQL query with the given data and fetch one row
    def selectUm(self, query, data):
        self.connect()
        with self.cursor as cursor:
            cursor.execute(query, data)
            result = cursor.fetchone()
        return result