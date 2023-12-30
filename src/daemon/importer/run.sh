#!/bin/bash

if [ $USE_DEV_MODE = "true" ];
  then nodemon --exec python -u main.py;
  else python -u main.py;
fi