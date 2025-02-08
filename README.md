# BlogApp

BlogApp It's my app for practicing my development skills.
Writing in Go and Fiber on the server side and React Typescript for the Client.

**_Table of Contents_**

- [Getting Started](#getting-started)
  - [Prerequisties](#prerequisties)
  - [Installing](#installing)
  - [Setup environment](#setup-environment)
- [Running the app](#running-the-app)
- [Running the unit tests](#running-the-unit-tests)
- [Build](#build)
- [Authors](#authors)
- [Required Technologies](#required-technologies)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development 
and testing.

### Prerequisites

You need to following modules and dependencies installed to run this project:

```bash
docker-compose..# to run postgres database on docker
go 1.23.........# to run server application
node 22.........# To run the client application
npm.............# For dependency management
```

### Installing

Simply, run the following command to install the project dependencies:

```bash
cd client
npm i
cd ..
cd server
go mod download
```

### Setup environment

First, create a `.env` file in server folder with all the required environment variables:

```bash
# .env
PORT=3000
NODE_ENV=dev

# DB
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_DB=your-db
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

# jwt & hash
JWT_SECRET=your-secret-key
```

Next, start the Postgres server on Docker:

```bash
cd server
docker-compose up
```

## Running the app

To run the project

```bash
cd server
go run main.go

cd client
npm run dev
```

## Running the unit tests

To run unit test

```bash
blogapp/clinet
npm run test

blogapp/server
go test ./tests
```

## Build

To build the application

```bash
blogapp/client
npm run build

blogapp/server
go build
```

## Authors

- [@mocrespo](https://www.github.com/mocrespo)

## REQUIREMENTS

- [REQUIREMENTS](/REQUIREMENTS.md)
