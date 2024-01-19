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

function Countries() {

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);
    const [maxDataSize, setMaxDataSize] = useState(0);

    useEffect(() => {
        setData(null);
        setTimeout(() => {
            fetch(`http://localhost:20001/cars?page=${page}`)
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
            <h1>Countries</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" width={"100px"} align="center">Country ID</TableCell>
                            <TableCell>Country Iso_country</TableCell>
                            <TableCell>Country Continent</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data ?
                                data.map((row) => (
                                    <TableRow key={row.id_brand} style={{background: "black", color: "black"}}>
                                        <TableCell component="td" align="center">{row.id_country}</TableCell>
                                        <TableCell component="td" scope="row">{row.iso_country}</TableCell>
                                        <TableCell component="td" scope="row">{row.continent}</TableCell>
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
export default Countries;