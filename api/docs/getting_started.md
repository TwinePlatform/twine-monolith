# Developer Setup Guide

## Contents

1.  [Getting started](#getting-started)
1.  [Running the server](#running-the-server)
1.  [Database](#database)
1.  [Configuration](#configuration)

## Getting Started
Instructions for setting up the monorepo [can be found here](../../docs).

## Running the server

### Dev Mode 👀
The following script are setup to watch changes made and automatically restart the server.
```
npm run dev
```
This will rebuild and restart the server whenever a change is made.

### Production
The following scripts start the server once.
```
npm run build
npm run start
```

## Database

Start the postgres server.

Create two databases, one for testing locally, one for running the app locally, using either the `createdb` utility or by connecting to the Postgres server and running the equivalent SQL command.

```sh
createdb <DB_NAME>
```

```SQL
CREATE DATABASE <DB_NAME>;
```

The database uses a PostGIS extention for handling location queries. If not already installed instructions can be found [here](https://postgis.net/install/). To enable PostGIS, connect to your database and run the following command:

```SQL
CREATE EXTENSION postgis;
```

You'll also need to add the `CITEXT` extension to deal with case-insensitive fields:

```SQL
CREATE EXTENSION citext;
```

## Configuration

To configure the application see the [configuration guide](./configuration.md).
