#!/bin/bash
# get cmd line arg default to tweeter-container if none
CONTAINER_NAME=${1:-tweeter-container}

# stop and remove old container
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker build -t tweeter .
docker run -d --name $CONTAINER_NAME -p 5050:5050 --env-file config/.env tweeter
