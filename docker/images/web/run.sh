#!/bin/bash

npm install;

export NEXT_PUBLIC_API_ENTITIES_URL=$API_ENTITIES_URL
export NEXT_PUBLIC_API_GIS_URL=$API_GIS_URL
export NEXT_PUBLIC_API_GRAPHQL_URL=$API_GRAPHQL_URL
export NEXT_PUBLIC_API_PROC_URL=$API_PROC_URL
export PORT=$WEB_PORT

if [ $USE_DEV_MODE = "true" ];
  then
    npm run dev;
  else
    npm run build;
    npm run start;
fi