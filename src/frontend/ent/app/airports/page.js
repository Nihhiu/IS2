"use client";
import React, { useEffect, useState } from 'react';
import crudAPI from '../crud/crudAPI';

export default function AirportsPage() {
    const [airport, setAirport] = useState([]);
  
    useEffect(() => {
      const fetchAirports = async () => {
        try {
          const response = await crudAPI().GET('/airport'); 
          setAirport(response.data); 
        } catch (error) {
          console.error('Erro ao buscar jogadores:', error);
        }
      };
  
      fetchAirports();
    }, []);
  
    return (
      <main>
        <b>Airports Page</b>: 
        <ul>
          {setAirport.map((airport) => (
            <li key={airport.id}>{airport.name}</li> 
          ))}
        </ul>
      </main>
    );
  }