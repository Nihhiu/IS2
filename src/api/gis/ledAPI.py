import json
from urllib import request, error, parse

def led(US):
    try:
        params = parse.urlencode({
            'iso_country': US,
            'format': json
        })
        with request.urlopen(f'https://nominatim.openstreetmap.org/search?{params}') as r:
            if r.status == 200:
                data = json.loads(r.read())
                return data
            else:
                print(f"Error: {r.status}, {r.reason}")
                return None
    except error.URLError as e:
        print(f"URL Error: {e.reason}")
        return None
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return None


