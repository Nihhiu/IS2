import React from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import ObjectMarkersGroup from "./ObjectMarkersGroup";

function ObjectsMap() {
    return (
        <MapContainer style={{width: "100%", height: "100vh"}}
                      center={[39.677489, -100.433103]} //41.69462, -8.84679
                      zoom={8}
                      scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ObjectMarkersGroup/>
        </MapContainer>
    );
}

export default ObjectsMap;