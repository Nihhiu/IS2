import {Avatar, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import React from "react";
import {Marker, Popup} from 'react-leaflet';
import {icon as leafletIcon, point} from "leaflet";
import Battery4BarIcon from '@mui/icons-material/Battery4Bar';
import TodayIcon from '@mui/icons-material/Today';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SellIcon from '@mui/icons-material/Sell';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TagIcon from '@mui/icons-material/Tag';


const LIST_PROPERTIES = [
    {"key": "id", label: "ID", Icon: TagIcon},
    {"key": "ident", label: "Ident", Icon: TodayIcon},
    {"key": "type", label: "type", Icon: AttachMoneyIcon},
    {"key": "name", label: "Name", Icon: Battery4BarIcon},
    {"key": "elevation_ft", label: "Elevation_ft", Icon: DriveEtaIcon},
    {"key": "iata_code", label: "Iata_code", Icon: SellIcon},
    {"key": "coordinates", label: "Coordinates", Icon: LocationOnIcon},

];




export function ObjectMarker({geoJSON}) {
    const properties = geoJSON?.properties
    const {img, id, ident, type, name, elevetaion_ft, iata_code, coordinates} = properties;
    const coordinate = geoJSON?.geometry?.coordinate;

    return (
        <Marker
            position={coordinate}
            icon={leafletIcon({
                iconUrl: img,
                iconRetinaUrl: img,
                iconSize: point(50, 50),
            })}
        >
            <Popup>
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar alt={country_name + " " + region_name} src={img}/>
                        </ListItemIcon>
                        <ListItemText primary={country_name + " " + region_name}/>
                    </ListItem>
                    {
                        LIST_PROPERTIES
                            .map(({key, label, Icon}) =>
                                <ListItem key={key}>
                                    <ListItemIcon>
                                        <Icon style={{color: "black"}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<span>
                                        {properties[key]}<br/>
                                        <label style={{fontSize: "xx-small"}}>({label})</label>
                                    </span>}
                                    />
                                </ListItem>
                            )
                    }

                </List>

            </Popup>
        </Marker>
    )
}