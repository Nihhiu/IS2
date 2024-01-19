import {useEffect, useState} from "react";
import {
    CircularProgress,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

function Airports() {

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [maxDataSize, setMaxDataSize] = useState(0);

    useEffect(() => {
        setData(null);
        setTimeout(() => {
            fetch(`http://localhost:20001/brands?page=${page}`)
                .then(response => response.json())
                .then(result => {
                    setData(result.data);
                    setMaxDataSize(result.total);
                })
                .catch(error => console.error('Error fetching data:', error));
        }, 500);
    }, [page])

    return (
        <>
            <h1>Airports</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" width={"100px"} align="center">Airport ID</TableCell>
                            <TableCell>Airport Ident</TableCell>
                            <TableCell>Airport Type</TableCell>
                            <TableCell>Airpory Name</TableCell>
                            <TableCell>Airport Elevation_ft</TableCell>
                            <TableCell>Airport Iata_code</TableCell>
                            <TableCell>Airport Coordinates</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data ?
                                data.map((row) => (
                                    console.log('Row Data:', row),
                                    <TableRow
                                        key={row.ident}
                                        style={{background: "black", color: "black"}}
                                    >
                                        <TableCell component="td" align="center">{row.id_airport}</TableCell>
                                        <TableCell component="td" scope="row">{row.ident}</TableCell>
                                        <TableCell component="td" scope="row">{row.type}</TableCell>
                                        <TableCell component="td" scope="row">{row.name}</TableCell>
                                        <TableCell component="td" scope="row">{row.elevation_ft}</TableCell>
                                        <TableCell component="td" scope="row">{row.iata_code}</TableCell>
                                        <TableCell component="td" scope="row">{row.coordinates}</TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <CircularProgress/>
                                    </TableCell>
                                </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                maxDataSize && <div style={{background: "black", padding: "1rem"}}>
                    <Pagination style={{color: "yellow"}}
                                variant="outlined" shape="rounded"
                                color={"primary"}
                                onChange={(e, v) => {
                                    setPage(v)
                                }}
                                page={page}
                                count={Math.ceil(maxDataSize / PAGE_SIZE)}
                    />
                </div>
            }


        </>
    );
}

export default Airports;