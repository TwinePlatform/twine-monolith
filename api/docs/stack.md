# Stack

## 🔍 Contents
1. [Backend](#-Backend)
2. [Type Checker](#-Type-Checker)
3. [Database](#-Database)
4. [References](#-References)

## 🛰 Backend

The server-side application is written in [Node.js](https://nodejs.org/en/) using the [Hapi js 17](https://hapijs.com/) framework. Hapi is ideal for an api serving multiple applications as it's designed for authentication strategies, and it's inbuilt support for [joi](https://github.com/hapijs/joi) validation. 

## 🗜 Type Checker
[TypeScript](https://www.typescriptlang.org/) is used for static typing to offer type checking when compiling. It was chosen over other options to due the open source type definitions for hapis api. 

## 🗃 Database

[PostgreSQL](https://www.postgresql.org/) is used for all data persistence.

## 🎓 References
- [Typescript docs](https://www.typescriptlang.org/)
- [DWYL example](https://github.com/dwyl/hapi-typescript-example)