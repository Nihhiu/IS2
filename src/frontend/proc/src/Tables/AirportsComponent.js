import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const DEMO_AIRPORTS = [
  {
    id: "111",
    ident: "01PN",
    type: "small_airport",
    name: "Bierly(Personal Use) Airport",
    elevation_ft: "960",
    iata_code: "",
    coordinates: "-77.73889923095703, 40.930599212646484"
  }
  ];

  function AirportsComponent() {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [page] = useState(1);
    const [procData, setProcData] = useState(null);
    const [gqlData, setGQLData] = useState(null);
    const [COUNTRY, setCOUNTRY] = useState([]);
  
    useEffect(() => {
      // Simulating data retrieval from the server
      setCOUNTRY([]);
      setTimeout(() => {
        // Fetch data from the country API endpoint
        fetch(`http://localhost:20004/api/country`)
          .then((response) => response.json())
          .then((result) => {
            // Update the state with the received data
            console.log("Country Data:", result);
            setCOUNTRY(result);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, 500);
    }, [page]);

    useEffect(() => {
        setProcData(null);
        setGQLData(null);
    
        if (selectedCountry) {
          fetch(`http://localhost:20004/api/regions/country/${selectedCountry}`)
            .then((response) => response.json())
            .then((result) => {
              setProcData(result.map(airport => airport.name));
              setTimeout(() => {
                console.log(`fetching from ${process.env.REACT_APP_API_GRAPHQL_URL}`);
                setGQLData(
                  result.length > 0 ? result : DEMO_AIRPORTS.filter((a) => a.region === selectedCountry)
                );
              }, 1000);
            })
            .catch((error) => console.error("Error fetching data:", error));
        }
      }, [selectedCountry]);
    
      return (
        <>
          <h1>Airports by Country</h1>
    
          <Container
            maxWidth="100%"
            sx={{
              backgroundColor: "background.default",
              padding: "2rem",
              borderRadius: "1rem",
            }}
          >
            <Box>
              <h2 style={{ color: "white" }}>Options</h2>
              <FormControl fullWidth>
                <InputLabel id="country-select-label">Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="demo-simple-select"
                  value={selectedCountry}
                  label="Country"
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                  }}
                >
                  <MenuItem value={""}>
                    <em>None</em>
                  </MenuItem>
                  {COUNTRY.map((country) => (
                    <MenuItem key={country} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Container>
    
          <Container
            maxWidth="100%"
            sx={{
              backgroundColor: "info.dark",
              padding: "2rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              color: "white",
            }}
          >
            <h2>Results <small>(PROC)</small></h2>
            {procData ? (
              <ul>
                {procData.map((regions) => (
                  <li key={regions}>{regions}</li>
                ))}
              </ul>
            ) : selectedCountry ? (
              <CircularProgress />
            ) : (
              "--"
            )}
            <h2>Results <small>(GraphQL)</small></h2>
            {gqlData ? (
              <ul>
                {gqlData.map((data) => (
                  <li key={data.id}>{data.name}</li>
                ))}
              </ul>
            ) : selectedCountry ? (
              <CircularProgress />
            ) : (
              "--"
            )}
          </Container>
        </>
      );
    }
    
    export default AirportsComponent;
