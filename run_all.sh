#!/bin/bash

# Run the client and server in parallel

# Import MongoDB data

# Start MongoDB
sudo systemctl start mongod

# Import data
cd BigData && mongorestore --db BigData --dir .



# Run the server
cd server && ./run_server.sh &

# Run the client
cd client/client && ./run_client.sh &




