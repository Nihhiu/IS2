import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const DEMO_AIRPORTS = [
    { id: "1", ident: "00A", type: "heliport", name: "Total Rf Heliport", elevation_ft: 11, iata_code: "", coordinates: "-74.93360137939453, 40.07080078125" },
    { id: "43", ident: "00PA", type: "heliport", name: "R J D Heliport", elevation_ft: 402, iata_code: "", coordinates: "-75.74690246582031, 39.94889831542969" },
    { id: "44", ident: "00PN", type: "small_airport", name: "Ferrell Field", elevation_ft: 1301, iata_code: "", coordinates: "-80.211111, 41.2995" }
];

const COUNTRIES = [...new Set(DEMO_AIRPORTS.map(airport => airport.country))];

function TopAirports() {

    const [selectedCountry, setSelectedCountry] = useState("");

    const [procData, setProcData] = useState(null);
    const [gqlData, setGQLData] = useState(null);

    useEffect(() => {
        setProcData(null);
        setGQLData(null);

        if (selectedCountry) {
            setTimeout(() => {
                console.log(`fetching from ${process.env.REACT_APP_API_PROC_URL}`);
                setProcData(DEMO_AIRPORTS.filter(a => a.country === selectedCountry));
            }, 500);

            setTimeout(() => {
                console.log(`fetching from ${process.env.REACT_APP_API_GRAPHQL_URL}`);
                setGQLData(DEMO_AIRPORTS.filter(a => a.country === selectedCountry));
            }, 1000);
        }
    }, [selectedCountry])

    return (
        <>
            <h1>Top Airports</h1>

            <Container maxWidth="100%"
                sx={{ backgroundColor: 'background.default', padding: "2rem", borderRadius: "1rem" }}>
                <Box>
                    <h2 style={{ color: "white" }}>Options</h2>
                    <FormControl fullWidth>
                        <InputLabel id="countries-select-label">Country</InputLabel>
                        <Select
                            labelId="countries-select-label"
                            id="demo-simple-select"
                            value={selectedCountry}
                            label="Country"
                            onChange={(e, v) => {
                                setSelectedCountry(e.target.value)
                            }}
                        >
                            <MenuItem value={""}><em>None</em></MenuItem>
                            {
                                COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
            </Container>

            <Container maxWidth="100%" sx={{
                backgroundColor: 'info.dark',
                padding: "2rem",
                marginTop: "2rem",
                borderRadius: "1rem",
                color: "white"
            }}>
                <h2>Results <small>(PROC)</small></h2>
                {
                    procData ?
                        <ul>
                            {
                                procData.map(data => <li key={data.airport}>{data.airport}</li>)
                            }
                        </ul> :
                        selectedCountry ? <CircularProgress /> : "--"
                }
                <h2>Results <small>(GraphQL)</small></h2>
                {
                    gqlData ?
                        <ul>
                            {
                                gqlData.map(data => <li key={data.airport}>{data.airport}</li>)
                            }
                        </ul> :
                        selectedCountry ? <CircularProgress /> : "--"
                }
            </Container>
        </>
    );
}

export default TopAirports;