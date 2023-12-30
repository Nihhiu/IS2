#!/bin/bash

if [ "$USE_DEV_MODE" = "true" ];
  then nodemon --exec python -u main.py $API_PORT;
  else python -u main.py $API_PORT;
fi