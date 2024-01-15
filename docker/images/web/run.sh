#!/bin/bash

npm install;

export REACT_APP_API_ENTITIES_URL=$API_ENTITIES_URL
export REACT_APP_API_GIS_URL=$API_GIS_URL
export REACT_APP_API_GRAPHQL_URL=$API_GRAPHQL_URL
export REACT_APP_API_PROC_URL=$API_PROC_URL

if [ $USE_DEV_MODE = "true" ];
  then
    npm run start;
  else
    npm run build;
    node server $WEB_PORT;
fi