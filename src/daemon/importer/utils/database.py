import psycopg2

class Database:
    def __init__(self):
        # Database connection parameters
        self.connection = None
        self.cursor = None
        self.user = "is"
        self.password = "is"
        self.host = "db-xml"
        self.port = "5432"
        self.database = "is"

    # Establish a database connection if not already connected
    def connect(self):
        if self.connection is None:
            try:
                # Attempt to connect to the database
                self.connection = psycopg2.connect(
                    user=self.user,
                    password=self.password,
                    host=self.host,
                    port=self.port,
                    database=self.database
                )
                # Create a cursor for executing SQL queries
                self.cursor = self.connection.cursor()
                print("\nConnected to the database")
            except psycopg2.Error as error:
                # Handle connection errors
                print(f"\nError: {error}")

    # Disconnect from the database if connected
    def disconnect(self):
        if self.connection:
            try:
                # Close the cursor and the database connection
                self.cursor.close()
                self.connection.close()
                print("\nDisconnected from the database")
            except psycopg2.Error as e:
                # Handle disconnection errors
                print(f"\nError: {e}")

    # Connect to the database
    def insert(self, sql_query, data):
        self.connect()
        try:
            # Execute the SQL query with provided data and commit the changes
            self.cursor.execute(sql_query, data)
            self.connection.commit()
            print("\nQuery executed successfully")
        except psycopg2.Error as error:
            # Handle insertion errors
            print(f"\nError: {error}")

    # Connect to the database
    def select(self, sql_query):
        self.connect()
        try:
            # Execute the SQL query and fetch the result
            self.cursor.execute(sql_query)
            result = self.cursor.fetchall()
            return result
        except psycopg2.Error as error:
            # Handle selection errors
            print(f"\nError: {error}")

    # Connect to the database
    def insert_many(self, sql_query, data_list):
        self.connect()
        try:
            # Execute the SQL query with a list of data and commit the changes
            self.cursor.executemany(sql_query, data_list)
            self.connection.commit()
            print("\nQuery executed successfully")
        except psycopg2.Error as error:
            # Handle insertion errors for multiple records
            print(f"\nError: {error}")

#
# The Database class facilitates interaction with a PostgreSQL database.
# It includes methods for connecting and disconnecting, inserting single or multiple records, and selecting records.
# Connection parameters are configured in the constructor, and the psycopg2 library is used for PostgreSQL interactions.
# Error handling is implemented throughout the class to manage potential database-related issues.
