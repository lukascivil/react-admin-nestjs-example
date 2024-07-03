<p align="center">
  <a href="https://marmelab.com/react-admin/" target="blank"><img src="https://marmelab.com/react-admin/assets/logo_white.png" width="220" alt="react-admin" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://docs.nestjs.com/assets/logo-small-gradient.svg" width="220" alt="nestjs" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="220" alt="postgresql" /></a>
</p>

<p align="center">Tasker-<strong>Client</strong>, a task registration application</p>
<p align="center">(CRUD example of React-Admin and RTK Query + nestjs + postgress)</p>

## Description

Tasker is an application for registering tasks. The client side was created using [React-Admin](https://marmelab.com/react-admin/Readme.html) following the REST pattern on dataproviders. The backend application that will server the API was created using [nestjs](https://docs.nestjs.com/) framework with [postgresql](https://www.postgresql.org/). This is an example of a react-admin application and shows how powerful the tool is, and how it is possible to create CRUD systems with nestjs.

The example project follows the line of being a laboratory for study, therefore tests with [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) are present as well.

This is a monorepo tha uses yarn workspaces to orchestrate it.

## Screenshot

![image](https://user-images.githubusercontent.com/7409802/123529179-4e44d500-d6c4-11eb-811b-f2b1406cb58b.png)

![GIF 15-11-2020 20-29-13](https://user-images.githubusercontent.com/7409802/99199957-5aa59e80-2781-11eb-9bd6-09e14f9c0981.gif)

## 1- Installation

```bash
$ yarn
```

## 2- Running the app (react admin client + nestjs server + postgres DB)

```bash
# Development
$ yarn start
```

## 3- Create first user with login and password

```bash
// You need a client to connect to postgres on 127.0.0.1:5432
// Its recommended to use https://www.heidisql.com/ but feel free to decide.
INSERT INTO "public"."user" ("id", "name", "email", "password") VALUES (1, 'admin', 'admin@gmail.com', "admin");
```
