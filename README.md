Tech Stack
This web app was developed using HTML, CSS, JavaScript, BootStrap, React, Express, Node, PostgreSQL, and Knex.

API Documentation
Route	Method	Status Code	Description
/reservations	GET	200	Returns a list of reservations for the current date
/reservations?date=####-##-##	GET	200	Returns a list of reservations for the given date
/reservations	POST	201	Creates a new reservation
/reservations/:reservation_id	GET	200	Returns the reservation for the given ID
/reservations/:reservation_id	PUT	200	Updates the reservation for the given ID
/reservations/:reservation_id/status	PUT	200	Updates the status of the reservation for the given ID
/tables	GET	200	Returns a list of tables
/tables	POST	201	Creates a new table
/tables/:table_id	GET	200	Returns the table for the given ID
/tables/:table_id/seat	PUT	200	Seats a reservation at the given table_id
/tables/:table_id/seat	DELETE	200	Changes the occupied status to be unoccupied for the given table_id
Reservation JSON Example
{
   "reservation_id": 7,
   "first_name": "Sarah",
   "last_name": "Connor",
   "mobile_number": "6785551234",
   "status": "booked",
   "reservation_date": "2021-09-03T04:00:00.000Z",
   "reservation_time": "21:00:00",
   "people": 3,
   "created_at": "2021-09-03T20:19:16.754Z",
   "updated_at": "2021-09-03T20:19:16.754Z"
}
Table JSON Example
{
  "table_id": 1,
   "table_name": "#1",
   "capacity": 6,
   "occupied": false,
   "reservation_id": null,
   "created_at": "2021-09-02T21:43:17.773Z",
   "updated_at": "2021-09-02T21:43:17.773Z"
}
Installation
To install dependencies, use npm install.

npm install
To start the React web page, use npm start.

npm run start
Connect to a postgresql database by using the following command to create a .env file from the sample provided.

cp .env.sample .env
Then fill in your .env file with your backend URL.

// front-end .env example -> Connects to server
// REACT_APP_API_BASE_URL=http://localhost:5000



![dashboard](https://user-images.githubusercontent.com/71313420/133494496-7e7d42d8-5c0c-472f-8cd9-0995a9b9f6da.png)
![create-a-reservation](https://user-images.githubusercontent.com/71313420/133494491-629fd7cb-86c4-4b7e-844f-2503f11d6f6a.png)
![create-a-table](https://user-images.githubusercontent.com/71313420/133494492-a1415c6d-0c2a-41a6-ba0c-3a3f856de897.png)
![search-for-reservation](https://user-images.githubusercontent.com/71313420/133494498-c131dd46-a263-408b-925e-d55281a427c5.png)
![seat-a-reservation](https://user-images.githubusercontent.com/71313420/133494500-d7ca6477-9023-4d98-a055-dd8299847970.png)

