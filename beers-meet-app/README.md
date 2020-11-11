# BeersMeetApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.3.


## Run APP

First run `npm i` to install dependencies && `npm run build` to build app, finally `npm start` and  Navigate to `http://localhost:3200/`. (list of valid users to login on readme file bottom)

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests.


## Endpoint SWAGGER
http://localhost:3200/api-docs


## Users to login app

(role admin)
user = admin@mail.com
pass = qwer1234

(role user)
user = juan.perez@mail.com
pass = 2wsx3edc

user = pedro.juarez@mail.com
pass = 1qaz2wsx

user = monica.rodriguez@mail.com
pass = qazwsx

user = jose.hernandez@mail.com
pass = qweasd

user = juliana.paez@mail.com
pass = dcfvgb

## STACK app 
-Front: Angular v10.1.3
-Back: Nodejs v12.18.3
-DB: Mongodb v4.4.0
-Test: Jest

## NOTES 

dbName: beerMeetup

CIRCUIT BREAKER Hystrix compatibility issue

Se intentó implementar la libreria hystrixjs v0.2.0 para nodejs, la misma presento incompatibilidad para streamear los datos ya que utilizaba la version de rxjs 5.0 incompatible con la version de rxjs requerida (< 6.0) por Angular. 

##
