# Developer Setup Guide

## Contents

1.  [Pre-requisites](#prerequisites)
2.  [Getting started](#getting-started)
3.  [Database](#database)
4.  [Configuration](#configuration)
5.  [Server app](#server-app)
6.  [Client app](#client-app)

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

## Database

Start the postgres server.

Create two databases, one for testing locally, one for running the app locally, using either the `createdb` utility or by connecting to the Postgres server and running the equivalent SQL command.

```sh
createdb <DB_NAME>
```

```SQL
CREATE DATABASE <DB_NAME>;
```

## Configuration

To configure the application see the [configuration guide](./configuration.md).
