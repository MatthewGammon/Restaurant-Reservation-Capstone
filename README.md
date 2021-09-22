# Thinkful-Final-Capstone: Restaurant Reservation System

## Deployed Application
[Quick Rez: Reservation and Seating](https://res-rev-capstone-frontend.herokuapp.com/dashboard)



## Project Summary
A full stack web application built with React, Node, Express, CSS, Bootstrap and connected to a PostgreSQL database. The development process included the creation and use of a Trello board, Github Projects, and frequent deployment with Heroku.
This application allows a user to create, edit, and cancel a reservation. Create a table, seat a reservation to a table, and finish a table. As well as search for reservations by phone number(partial or complete). 

[Trello Board](https://trello.com/b/z4kS34b7/restaurant-reservation-capstone) 

### The Dashboard
![dashboard](https://user-images.githubusercontent.com/71313420/133494496-7e7d42d8-5c0c-472f-8cd9-0995a9b9f6da.png)
### Create new Reservation
![create-a-reservation](https://user-images.githubusercontent.com/71313420/133494491-629fd7cb-86c4-4b7e-844f-2503f11d6f6a.png)
### Create new Table
![create-a-table](https://user-images.githubusercontent.com/71313420/133494492-a1415c6d-0c2a-41a6-ba0c-3a3f856de897.png)
### Search for Reservation
![search-for-reservation](https://user-images.githubusercontent.com/71313420/133494498-c131dd46-a263-408b-925e-d55281a427c5.png)
### Seat a Reservation
![seat-a-reservation](https://user-images.githubusercontent.com/71313420/133494500-d7ca6477-9023-4d98-a055-dd8299847970.png)


## Technologies and Tools
* React
* JavaScript
* Node
* Express
* PostgreSQL
* HTML
* CSS
* Heroku

## API Documentation

| Route       | Method      | Status Code | Description   |
| :---        |    :----:   |     :----:   |        ---:  |
| /reservations      | GET   | 200  | Returns a list of reservations for the current date |
| /reservations?date=####-##-##      | GET |  200    | Returns a list of reservations for the given date |
| /reservations      | POST  | 201    | Creates a new reservation |
| /reservations/:reservation_id      | GET  | 200     | Returns the reservation for the given ID |
| /reservations/:reservation_id      | PUT  | 200     | Updates the reservation for the given ID |
| /reservations/:reservation_id/status      | PUT  | 200     | Updates the status of the reservation for the given ID |
| /tables   | GET  | 200      | Returns a list of tables     |
| /tables   | POST  | 201      | Creates a new table     |
| /tables/:table_id/seat   | PUT | 200      | Seats a reservation at the given table_id     |
| /tables/:table_id/seat   | DELETE  | 200      | Changes the occupied status to be unoccupied for the given table_id     |


 ### Reservation JSON Example
 ```json
"data": {
        "reservation_id": 13,
        "first_name": "Chris",
        "last_name": "Sale",
        "mobile_number": "207-777-7777",
        "reservation_date": "2021-09-13T04:00:00.000Z",
        "reservation_time": "13:30:00",
        "people": 1,
        "status": "cancelled",
        "created_at": "2021-09-13T09:34:07.185Z",
        "updated_at": "2021-09-13T09:34:07.185Z"
    }
```

### Table JSON Example
 ```json
{
            "table_id": 8,
            "table_name": "Monster Seats",
            "capacity": 269,
            "reservation_id": 13
        }
```
## Installation
To install dependencies, verify you are in the project root and use npm install.
```
npm install || npm i
```

To start up the React app, from the project root directory, run 'npm run start:frontend'

To spin up the server on a localhost, from the project root directory, run 'npm run start:backend'








