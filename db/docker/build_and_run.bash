#!/bin/bash

docker build . -t node-todo-postgres-db

docker rm node-todo-postgres-db

exec docker run -p "5678:5432" --name node-todo-postgres-db node-todo-postgres-db