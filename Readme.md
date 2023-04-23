# ToDo SPA Application

## Goals

The aim of this application is just to demonstrate how to use Docker for developing and deploying a SPA full-stack application.

## Structure

The project is structured in three parts:
frontend
backend
database
Each folder contains a docker file and is a single container.

### Frontend

Is uses nginx as a web server and a reverse proxy to server the single page application (SPA) and also gives seamless access to the backend API.

### Backend

The backend is written in javascript based on node.js. The backend provides a simple C-R-U-D RestApi by using the express library.

### database

The persistence is done with MariaDB. This folder contains a docker file and a SQL file that contains the database scheme. For demonstration purposes, the database will be recreated every time the container is recreated.

## Run all at once.

To start the whole full-stack application there is a docker compose file. This docker-compose file combines all containers.
To start the application:

```:bash
docker-compose up -d
```