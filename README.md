# Calculator App

This is the frontend for the calculator app.

## Setup
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. `npm install`

2. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



## Environment Variables

The app relies on environment variables. Create a .env file in the root directory of the project with the following variables:

`REACT_APP_SRV_API_URL`: The URL for the server API. For local development, set this to `http://localhost:8000/`.

Example .env file:

`REACT_APP_SRV_API_URL=http://localhost:8000/`

## Deployment

For deploying the app, the following scripts are used:

Build: `npm run build`

Deploy: `npm run deploy`
