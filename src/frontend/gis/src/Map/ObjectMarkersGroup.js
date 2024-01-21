import React, {useEffect, useState} from 'react';
import {LayerGroup, useMap} from 'react-leaflet';
import {ObjectMarker} from "./ObjectMarker";
import L from 'leaflet';
import axios from 'axios';



function ObjectMarkersGroup() {

    const map = useMap();
    const [geom, setGeom] = useState([]);
    const [bounds, setBounds] = useState(map.getBounds());
    const [visibleGeo, setVisibleGeo] = useState([]);
    


    useEffect(() => {
        const cb = () => {
            setBounds(map.getBounds());
        }
        map.on('moveend', cb);

        return () => {
            map.off('moveend', cb);
        }
    }, []);

    useEffect(() => {
        if (!bounds) return;

        if (Array.isArray(geom) && geom.length && geom!=null) {
            const visibleGeo = geom.filter(marker => {
            const point = L.latLng(marker.geometry.coordinates[0], marker.geometry.coordinates[1]);
            return bounds.contains(point);
            });
        }
        setVisibleGeo(visibleGeo);
    }, [bounds, geom])

    const  asyncFetch = async () => {
        await axios.get("http://localhost:20002/api/airport")
            .then((response) => {
                setGeom(response.data)
            })
            .catch((error) => {
            console.log('fetch data failed', error);
            });
    };
        useEffect(() => {
        asyncFetch();
        }, []);

    console.log(geom)

    return (
        <LayerGroup>
            {
                geom.map(geoJSON => <ObjectMarker key={geoJSON.properties.id_airport} position={geoJSON.properties.geometry} geoJSON={geoJSON}/>)
            }
        </LayerGroup>
    );
}

export default ObjectMarkersGroup;