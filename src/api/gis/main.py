import sys
import psycopg2
import json
from ledAPI import led

from flask import Flask, request, jsonify, make_response

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/api/markers', methods=['GET'])
def get_airports():
    ne_lat = request.args.get('neLat')
    ne_lng = request.args.get('neLng')
    sw_lat = request.args.get('swLat')
    sw_lng = request.args.get('swLng')


    conn = psycopg2.connect(host='db-rel', database='is',
                            user='is', password='is')
    
    cursor = conn.cursor()

    # !TODO: query
    query = ("""SELECT
    airports.id AS airport_id,
    airports.ident,
    airports.type,
    airports.name,
    airports.elevation_ft,
    airports.iata_code,
    airports.coordinates,
    regions.id AS region_id,
    regions.iso_region,
    regions.municipality,
    regions.gps_code,
    regions.local_code,
    countries.id AS country_id,
    countries.continent,
    countries.iso_country
    FROM
        public.airports
    INNER JOIN
        public.regions ON airports.region = regions.id
    INNER JOIN
        public.countries ON regions.country = countries.id;
    """)

    if all([ne_lat, ne_lng, sw_lat, sw_lng]):
        query += (
            f"WHERE ST_Y(airports.coordinates::geometry) <= {ne_lat} "
            f"AND ST_Y(airports.coordinates::geometry) >= {sw_lat} "
            f"AND ST_X(airports.coordinates::geometry) <= {ne_lng} "
            f"AND ST_X(airports.coordinates::geometry) >= {sw_lng}"
        )

    result = cursor.execute(query)

    json = []
    
    for row in result:
        json.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(row[6]), float(row[7])]
            },
            "properties": {
                "airport_id": str(row[0]),
                "ident": row[1],
                "type": row[2],
                "name": row[3],
                "elevation_ft": row[4],
                "iata_code": row[5],
                "region_id": str(row[8]),
                "iso_region": row[9],
                "municipality": row[10],
                "gps_code": row[11],
                "local_code": row[12],
                "country_id": str(row[13]),
                "continent": row[14],
                "iso_country": row[15],
                "img": "https://img.icons8.com/?size=256&id=hKWbKdldBDoa&format=png"
            }
        })

    cursor.close()
    conn.close()

    res = make_response(jsonify(json))
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'GET'
    res.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return res

@app.route('/api/airport/<id>', methods=['PATCH'])
def patch_airport_geo(id):
    conn = psycopg2.connect(host='db-rel', database='is',
                            user='is', password='is')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM airport WHERE id = %s", (id,))

    name = cursor.fetchone()
    print(name)

    id_airport = id

    data = loc(name)
    cursor = conn.cursor()
    cursor.execute("UPDATE airport SET coordinates = ST_SETSRID(ST_MAKEPOINT(%s,%s), 4326) WHERE id = %s",
                   (data[0]['lon'], data[0]['lat'], id_airport))

    conn.commit()

    return "Updated successfully"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)
