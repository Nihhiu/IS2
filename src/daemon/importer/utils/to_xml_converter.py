import csv
import xml.dom.minidom as md
import xml.etree.ElementTree as ET

from utils.reader import CSVReader
from entities.country import Country
from entities.team import Team
from entities.player import Player


class CSVtoXMLConverter:

    def __init__(self, path):
        self._reader = CSVReader(path)

    def to_xml(self):
        # read countries
        countries = self._reader.read_entities(
            attr="nationality",
            builder=lambda row: Country(row["nationality"])
        )

        # read top_teams
        teams = self._reader.read_entities(
            attr="Current Club",
            builder=lambda row: Team(row["Current Club"])
        )

        # read players

        def after_creating_player(player, row):
            # add the player to the appropriate team
            teams[row["Current Club"]].add_player(player)

        self._reader.read_entities(
            attr="full_name",
            builder=lambda row: Player(
                name=row["full_name"],
                age=row["age"],
                country=countries[row["nationality"]]
            ),
            after_create=after_creating_player
        )

        # generate the final xml
        root_el = ET.Element("Football")

        teams_el = ET.Element("Teams")
        for team in teams.values():
            teams_el.append(team.to_xml())

        countries_el = ET.Element("Countries")
        for country in countries.values():
            countries_el.append(country.to_xml())

        root_el.append(teams_el)
        root_el.append(countries_el)

        return root_el

    def to_xml_str(self):
        xml_str = ET.tostring(self.to_xml(), encoding='utf8', method='xml').decode()
        dom = md.parseString(xml_str)
        return dom.toprettyxml()

