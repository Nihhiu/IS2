#!/bin/bash

# Check if not in dev mode
if [ "$USE_DEV_MODE" != "true" ]; then
  # Compile the project
  mix compile
fi

# Execute the project
if [ "$USE_DEV_MODE" = "true" ]; then
  nodemon --exec elixir main.exs;
else
  elixir main.exs;
fi
