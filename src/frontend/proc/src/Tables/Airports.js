import { useEffect, useState } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function Airports() {
  const [page] = useState(1);
  const [data, setData] = useState(null);
  const [setMaxDataSize] = useState(0);

  useEffect(() => {
    setData(null);
    setTimeout(() => {
      fetch(`http://localhost:20004/api/country`)
        .then((response) => response.json())
        .then((result) => {
          setData(result);
          setMaxDataSize(result.length);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }, 500);
  }, [page]);

  return (
    <>
      <h1>Airports</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell component="th" width={"100px"} align="center">
                Row
              </TableCell>
              <TableCell>Airport Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.map((airport, index) => (
                <TableRow
                  key={index}
                  style={{ background: "black", color: "black" }}
                >
                  <TableCell component="td" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {airport}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Airports;