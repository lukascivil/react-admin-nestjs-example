<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="220" alt="Nest Logo" /></a>
</p>

<p align="center">Tasker-<strong>Server</strong>, a task registration application</p>

![badge](https://action-badges.now.sh/lukascivil/tasker)
[![codecov](https://codecov.io/gh/lukascivil/tasker/branch/master/graph/badge.svg)](https://codecov.io/gh/lukascivil/tasker)

## Description

Tasker is an application for registering tasks. The server was created using Nestjs following the REST pattern. The front application that will use this app server will use the [react-admin](https://marmelab.com/react-admin/Readme.html) framework.

## Installation

### Installation

```bash
$ yarn
```

### DataBase

<strong>On windows</strong> you can download [xampp](https://www.apachefriends.org/) to up MySQL DB, its free application.
![image](https://user-images.githubusercontent.com/7409802/99200349-8164d480-2783-11eb-9815-426f1af7f73e.png)

<strong>On Linux</strong> you can install MySQL using apt

```bash
$ sudo apt update
$ sudo apt install mysql-server
```

### Running the DB

```bash
sudo systemctl start mysql
```

## Running the app

```bash
# development
$ yarn start:debug

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```

## Open API Documentation

```bash
# Swagger Docs
open http://localhost:3000/api
```

![image](https://user-images.githubusercontent.com/7409802/99883901-fcf1d600-2c08-11eb-9497-7b0f87562e7d.png)

## Project Architecture Documentation

```bash

# Docs with compodoc
$ yarn compodoc

open http://localhost:8080/
```

![image](https://user-images.githubusercontent.com/7409802/99883854-b43a1d00-2c08-11eb-9e3d-0242c5098e2f.png)

## Health

```bash
# Health API with Terminus
open http://localhost:3000/health
```

## Running the client

Read the docs of Tasker client here: https://github.com/lukascivil/our-admin

### Plus

If you want to view the tables in the DBMS and the documents created, you can use a graphical tool to access.
[HeidiSQL](https://www.heidisql.com/) is a free and powerful client for MariaDB, MySQL, Microsoft SQL Server, PostgreSQL and SQLite.
