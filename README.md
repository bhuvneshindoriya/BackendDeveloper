# Project Name
Backend Project Assignment



## Project Description

It provides an API for managing products and users.

## Installation

1. Clone the repository:


2. Install the dependencies:


3. Set up the environment variables:

- Create a `.env` file in the root directory of the project.
- Add the required environment variables with their corresponding values.

4. Start the server:


5. The server should now be running on `http://localhost:3001`.

## Usage

Provide detailed instructions on how to use the API. Include information such as authentication requirements, request and response formats, and any additional details that users need to know.

## API Endpoints

The following are the available API endpoints:

## Register a new user:

**URL: /api/register
Method: POST
Request Body:
{
    "username": "Bhuvnesh",
    "email": "Bhuvnesh@gmail.com",
    "password": "password"
}

## Login:

**URL: /api/login
Method: POST
Request Body:
POST /login: User login.
{
    "username": "Bhuvnesh",
    "password": "password"
}

## Create a new product
POST /api/items: 
Request Body:
{
  "name": "freez",
  "price": 30000,
  "description": "This is a sample product",
  "category": "Electronics"
}
Response:
{
    "name": "freez",
    "price": 30000,
    "description": "This is a sample product",
    "category": "Electronics",
    "user": "647ed70a6157c233f205cfdc",
    "_id": "647f112683c0f10a3df539e3",
    "createdAt": "2023-06-06T10:57:42.977Z",
    "__v": 0
}
## Get all products

## GET /api/items:
we can use pagination here-
Response-
{
    "products": [
        {
            "_id": "647f112683c0f10a3df539e3",
            "name": "freez",
            "price": 30000,
            "description": "This is a sample product",
            "category": "Electronics",
            "user": "647ed70a6157c233f205cfdc",
            "createdAt": "2023-06-06T10:57:42.977Z",
            "__v": 0
        },
        {
            "_id": "647edea5ef6af4775ec3652c",
            "name": "Television",
            "price": 100,
            "description": "This is sample product",
            "category": "Electronics",
            "user": "647ed70a6157c233f205cfdc",
            "createdAt": "2023-06-06T07:22:13.982Z",
            "__v": 0
        },
        {
            "_id": "647e3282eb4080c4543ad128",
            "name": "Sample Product",
            "price": 9.99,
            "description": "This is a sample product",
            "category": "Electronics",
            "__v": 0,
            "createdAt": "2023-06-06T10:59:04.421Z"
        },
        {
            "_id": "647e32dceb4080c4543ad12a",
            "name": "Sample Product",
            "price": 9.99,
            "description": "This is a sample product",
            "category": "Electronics",
            "__v": 0,
            "createdAt": "2023-06-06T10:59:04.421Z"
        }
    ],
    "totalPages": 1
}

## Get a specific product by ID.
## GET /api/items/:id: 
Response-
{
    "_id": "647f112683c0f10a3df539e3",
    "name": "freez",
    "price": 30000,
    "description": "This is a sample product",
    "category": "Electronics",
    "user": "647ed70a6157c233f205cfdc",
    "createdAt": "2023-06-06T10:57:42.977Z",
    "__v": 0
}
## Update a specific product by ID.
## PUT /api/items/:id: 
Request Body:
{
  "name": "Television",
  "price": 100,
  "description": "This is sample product",
  "category": "Electronics"
}
Response - 
{
  "name": "Television",
  "price": 100,
  "description": "This is sample product",
  "category": "Electronics"
}

## DELETE /api/items/:id: 
## Delete a specific product by ID.






