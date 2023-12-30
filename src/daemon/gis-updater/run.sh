#!/bin/bash

if [ $USE_DEV_MODE = "true" ];
  then nodemon --exec python -u main.py $POLLING_FREQ $ENTITIES_PER_ITERATION;
  else python -u main.py $POLLING_FREQ $ENTITIES_PER_ITERATION;
fi