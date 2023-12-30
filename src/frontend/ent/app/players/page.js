"use client";
import {useCallback, useEffect, useState} from "react";
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
import {useSearchParams, useRouter, usePathname} from 'next/navigation';

const DEMO_PLAYERS = [
    {"id": "31", "name": "Alexis Sanchez", "age": "33"},
    {"id": "39", "name": "Ander Herrera", "age": "33"},
    {"id": "45", "name": "Andreas Pereira", "age": "26"},
    {"id": "51", "name": "Angel Gomes", "age": "22"},
    {"id": "56", "name": "Anthony Martial", "age": "26"},
    {"id": "59", "name": "Antonio Valencia", "age": "37"},
    {"id": "66", "name": "Ashley Young", "age": "37"},
    {"id": "111", "name": "Chris Smalling", "age": "32"},
    {"id": "145", "name": "David de Gea", "age": "31"},
    {"id": "174", "name": "Eric Bertrand Bailly", "age": "28"},
    {"id": "185", "name": "Faustino Marcos Alberto Rojo", "age": "32"},
    {"id": "198", "name": "Frederico Rodrigues Santos", "age": "29"},
    {"id": "241", "name": "James Garner", "age": "21"},
    {"id": "265", "name": "Jesse Lingard", "age": "29"},
    {"id": "293", "name": "José Diogo Dalot Teixeira", "age": "23"},
    {"id": "304", "name": "Juan Mata", "age": "34"},
    {"id": "336", "name": "Lee Grant", "age": "39"},
    {"id": "356", "name": "Luke Shaw", "age": "27"},
    {"id": "368", "name": "Marcus Rashford", "age": "24"},
    {"id": "374", "name": "Marouane Fellaini", "age": "34"},
    {"id": "378", "name": "Mason Greenwood", "age": "20"},
    {"id": "388", "name": "Matteo Darmian", "age": "32"},
    {"id": "426", "name": "Nemanja Matić", "age": "34"},
    {"id": "441", "name": "Paul Pogba", "age": "29"},
    {"id": "449", "name": "Phil Jones", "age": "30"},
    {"id": "472", "name": "Romelu Lukaku", "age": "29"},
    {"id": "495", "name": "Scott McTominay", "age": "25"},
    {"id": "503", "name": "Sergio Germán Romero", "age": "35"},
    {"id": "525", "name": "Tahith Chong", "age": "22"},
    {"id": "546", "name": "Victor Nilsson Lindelöf", "age": "28"}
];


export default function PlayersPage({pagea}) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );
    const [data, setData] = useState(null);
    const [maxDataSize, setMaxDataSize] = useState(DEMO_PLAYERS.length);

    const page = parseInt(searchParams.get('page')) || 1;
    const PAGE_SIZE = 10;

    useEffect(() => {
        //!FIXME: this is to simulate how to retrieve data from the server
        //!FIXME: the entities server URL is available on process.env.REACT_APP_API_ENTITIES_URL
        setData(null);
        setTimeout(() => {
            console.log(`fetching from ${process.env.NEXT_PUBLIC_API_ENTITIES_URL}`)
            setData(DEMO_PLAYERS.filter((item, index) => Math.floor(index / PAGE_SIZE) === (page - 1)));
        }, 500);
    }, [page])

    return (
        <>
            <h1 sx={{fontSize: "100px"}}>Players</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "lightgray"}}>
                            <TableCell component="th" width={"1px"} align="center">ID</TableCell>
                            <TableCell>Player Name</TableCell>
                            <TableCell align="center">Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data ?
                                data.map((row) => (
                                    <TableRow
                                        key={row.id}
                                    >
                                        <TableCell component="td" align="center">{row.id}</TableCell>
                                        <TableCell component="td" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.age}
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <CircularProgress/>
                                    </TableCell>
                                </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                maxDataSize && <Pagination style={{color: "black", marginTop: 8}}
                                           variant="outlined" shape="rounded"
                                           color={"primary"}
                                           onChange={(e, v) => {
                                               router.push(pathname + '?' + createQueryString('page', v))
                                           }}
                                           page={page}
                                           count={Math.ceil(maxDataSize / PAGE_SIZE)}
                />
            }


        </>
    );
}
