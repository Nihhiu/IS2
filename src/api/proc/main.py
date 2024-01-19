import sys
import xmlrpc.client
from flask import request, Flask
from flask_cors import CORS

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

server = xmlrpc.client.ServerProxy("http://rpc-server:9000")

@app.route('/api/country', methods=['GET'])
def get_all_country():
    iso_country = server.fetch_country()
    return iso_country

@app.route('/api/region/country/<iso_country>', methods=['GET'])
def get_modelsByBrand(iso_country):
    iso_region = server.fetch_region_by_country(iso_country)
    return iso_region

@app.route('/api/airport/region/<iso_region>', methods=['GET'])
def get_modelsByBrand(iso_region):
    airport = server.fetch_airport_by_region(iso_region)
    return airport

@app.route('/api/airport/filtred/<order_by>/<ascending>', methods=['GET'])
def get_airportFiltred(order_by, ascending):
    ascending = ascending.lower() == 'asc'
    airport = server.fetch_with_filters(order_by, ascending)
    return airport

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)

