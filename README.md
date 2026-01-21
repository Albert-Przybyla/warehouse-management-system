# Warehouse Management System Configuration Documentation

## Prerequisites

Before you begin, make sure you have installed:

- Docker
- Make

## Configuration

To configure the project, first generate .env files:

```sh
make configure
```

## Building Containers

To build the required containers for all services, run:

```sh
make build
```

## Starting Services

To start all necessary services, use:

```sh
make up
```

## Stopping Services

To stop all services, use:

```sh
make stop
```

## Removing Services

To remove all services, use:

```sh
make down
```

## Development Mode

If you want to run the services and automatically sync backend files, use:

```sh
make watch
```
