"use client";
import React, { useEffect, useState } from 'react';
import crudAPI from '../crud/crudAPI';

export default function RegionPage() {
  const [region, setRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await crudAPI().GET('/region'); 
        setRegions(response.data); 
      } catch (error) {
        console.error('Erro ao buscar regiões:', error);
      }
    };

    fetchRegions();
  }, []);

  return (
    <main>
      <b>Countries Page</b>: 
      <ul>
        {region.map((region) => (
          <li key={region.id}>{region.iso_region}</li> 
        ))}
      </ul>
    </main>
  );
}