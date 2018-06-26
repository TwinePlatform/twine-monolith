# Developer Setup Guide

## Contents

1.  [Pre-requisites](#prerequisites)
2.  [Getting started](#getting-started)
3.  [Running the server](#running-the-server)
4.  [Database](#database)
5.  [Configuration](#configuration)
6.  [Server app](#server-app)
7.  [Client app](#client-app)

## Pre-requisites

* `node` (v10+) and `npm` (v6+)
* `postgresql` (v10+)

## Getting Started

Clone the repo with `https` or `ssh`:

```sh
# https
git clone https://github.com/TwinePlatform/twine-visitor.git
```

```sh
# ssh
git clone git@github.com:TwinePlatform/twine-visitor.git
```

After cloning, `cd` into the repo and install dependencies:

```sh
npm i
```

This will install dependencies for both the server and client apps.

Next...
```
npm i -g typescript
```
This will install typescript globally which will compile the project to `./built`

## Running the server

### Dev Mode 
👀 The following scripts are setup to watch changes made and automatically restart the server. Run the following two commands in separate terminals:

```
npm run watch
```
This will make typescript compile whenever a change is made.

```
npm run dev
```
This will restart the server whenever a change is made.

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

## Configuration

To configure the application see the [configuration guide](./configuration.md).
