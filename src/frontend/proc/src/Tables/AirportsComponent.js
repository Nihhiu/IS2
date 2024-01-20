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

  ];

  function AirportsComponent() {
    const [selectedRegion, setSelectedRegion] = useState("");
    const [page] = useState(1);
    const [procData, setProcData] = useState(null);
    const [gqlData, setGQLData] = useState(null);
    const [REGIONS, setREGIONS] = useState([]);
  
    useEffect(() => {
      // Simulating data retrieval from the server
      setREGIONS([]);
      setTimeout(() => {
        // Fetch data from the regions API endpoint
        fetch(`http://localhost:20004/api/regions`)
          .then((response) => response.json())
          .then((result) => {
            // Update the state with the received data
            console.log("Regions Data:", result);
            setREGIONS(result);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }, 500);
    }, [page]);

    useEffect(() => {
        setProcData(null);
        setGQLData(null);
    
        if (selectedRegion) {
          fetch(`http://localhost:20004/api/airports/region/${selectedRegion}`)
            .then((response) => response.json())
            .then((result) => {
              setProcData(result.map(airport => airport.name));
              setTimeout(() => {
                console.log(`fetching from ${process.env.REACT_APP_API_GRAPHQL_URL}`);
                setGQLData(
                  result.length > 0 ? result : DEMO_AIRPORTS.filter((a) => a.region === selectedRegion)
                );
              }, 1000);
            })
            .catch((error) => console.error("Error fetching data:", error));
        }
      }, [selectedRegion]);
    
      return (
        <>
          <h1>Airports by Region</h1>
    
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
                <InputLabel id="regions-select-label">Region</InputLabel>
                <Select
                  labelId="regions-select-label"
                  id="demo-simple-select"
                  value={selectedRegion}
                  label="Region"
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                  }}
                >
                  <MenuItem value={""}>
                    <em>None</em>
                  </MenuItem>
                  {REGIONS.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.name}
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
                {procData.map((airport) => (
                  <li key={airport}>{airport}</li>
                ))}
              </ul>
            ) : selectedRegion ? (
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
            ) : selectedRegion ? (
              <CircularProgress />
            ) : (
              "--"
            )}
          </Container>
        </>
      );
    }
    
    export default AirportsComponent;
