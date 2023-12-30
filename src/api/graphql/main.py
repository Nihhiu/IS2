import sys

from flask import Flask
import magql
from flask_magql import MagqlExtension

schema = magql.Schema()

@schema.query.field(
    "greet", "String!", args={"name": magql.Argument("String!", default="World")}
)
def resolve_greet(parent, info, **kwargs):
    name = kwargs.pop("name")
    return f"Hello, {name}!"

magql_ext = MagqlExtension(schema)

app = Flask(__name__)
app.config["DEBUG"] = True
magql_ext.init_app(app)
app.run(host="0.0.0.0", port=sys.argv[1])

