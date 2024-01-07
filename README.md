
# Trustlog

![Logo.](https://trustlog.png "Logo")

## Project Description
TrustLog is a revolutionary platform designed to maintain the authenticity and ownership history of luxury watches. It serves as a reliable and transparent database where watch owners and brands can securely store and access information related to the provenance and ownership of high-end timepieces.

The primary objective of TrustLog is to combat counterfeiting and establish a trusted system that verifies the authenticity of watches in the market. TrustLog ensures that every watch's history is immutably recorded and accessible to authorized individuals.



## Technologies Used

* Node JS
* Express JS
* My Sql
* Sequelize ORM
* Passport JS



## Installation and Setup Instructions
To get started, clone this repository and install the required dependencies.

### Prerequisites
* Node.js (version 18.0 or higher)

### Installation
##### Clone the repository:

git clone https://github.com/Crebos-International/m3-react-frontend.git


 ##### Install the required dependencies:

  :npm install

 ##### Running the Application:
Start the application with the following command:

  : npm start

The application will be served at http://localhost:3000.


## Folder Structure


├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── README.md
├── app.js
├── bin
│   └── www
├── config
│   └── logger.js
├── constants
│   └── constants.js
├── info.txt
├── logs
│   └── app.log
├── middleware
│   ├── baseMiddleware.js
│   ├── errorHandler.js
│   └── passport
│       └── index.js
├── models
│   ├── index.js
│   ├── init-models.js
│   └── user.js
├── package-lock.json
├── package.json
├── seeders
├── services
│   ├── db.js
│   └── mailService.js
├── src
│   ├── admin
│   │   ├── index.js
│   │   └── users
│   │       ├── controller.js
│   │       ├── controllerUtils.js
│   │       ├── index.js
│   │       ├── routes.js
│   │       └── validator.js
│   ├── index.js
│   └── app
│       ├── index.js
│       └── users
│           ├── controller.js
│           ├── controllerUtils.js
│           ├── index.js
│           ├── routes.js
│           └── validator.js
└── utils
    ├── errorHandlers
    │   ├── appError.js
    │   └── catchAsync.js
    ├── response
    │   ├── responseCodes.js
    │   ├── responseMessages.js
    │   └── responseUtils.js
    └── utils.js


### .env
 This file is used to store environment-specific configuration variables for the project.

### .env.example
This file serves as an example for the .env file, providing a template for required environment variables.

### .gitignore
This file tells Git which files and directories to ignore when you commit changes to your project.

### README.md
This file contains information about your project, including its purpose, features, and instructions for use.

### .sequelizerc
 This file is used by Sequelize, an ORM (Object-Relational Mapping) library, to configure paths and aliases for the project's models, migrations, and seeders.

### package-lock.json and package.json
These files contain the configuration for your project's dependencies. package.json is the main configuration file, while package-lock.json keeps track of the specific versions of each dependency.

### services
This folder contains service files used in the application. It includes a `db.js` file for database-related operations and a `mailService.js` file for email-related operations.

### src

  ##### &nbsp; &nbsp; &nbsp;&nbsp;admin: 
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; This directory represents the admin module of the application. It contains an index.js file which serves as the entry point for the admin module. The users directory within admin contains files related to user management in the admin module.

##### &nbsp; &nbsp; &nbsp;&nbsp; controller.js: 
&nbsp; &nbsp; &nbsp;&nbsp; This file defines the controller logic for handling user-related operations in the admin module.
##### &nbsp; &nbsp; &nbsp;&nbsp; controllerUtils.js:
&nbsp; &nbsp; &nbsp;&nbsp;  This file contains utility functions used by the user controller in the admin module.
##### &nbsp; &nbsp; &nbsp;&nbsp; index.js: 
&nbsp; &nbsp; &nbsp;&nbsp;  This file is the entry point for the user management in the admin module. It may define routes or import other necessary files.
##### &nbsp; &nbsp; &nbsp;&nbsp;  routes.js:
&nbsp; &nbsp; &nbsp;&nbsp;  This file defines the routes specific to user management in the admin module.
##### &nbsp; &nbsp; &nbsp;&nbsp; validator.js: 
&nbsp; &nbsp; &nbsp;&nbsp;  This file contains validation logic for user-related operations in the admin module.
##### &nbsp; &nbsp; &nbsp;&nbsp; index.js:
&nbsp; &nbsp; &nbsp;&nbsp; This file serves as the entry point of the application. It may initialize the server, set up middleware, and define routes for the main application.

### app.js
The main entry point of the application. It sets up the server and includes middleware configurations.

### bin/www
This file is used to create an HTTP server using the application and listen on a specific port.

### config
This directory contains configuration files for the project. It includes a logger.js file for configuring logging.

### constants
This directory contains files defining constants used throughout the application. The constants.js file may include commonly used constants.

### logs
This directory is used to store application logs. The app.log file is an example log file.

### middleware
This directory contains middleware functions used in the application. It includes a baseMiddleware.js file and an errorHandler.js file for handling errors. The passport directory includes authentication-related middleware.

### models
This directory contains database models defined for the project. The index.js file sets up the database connection, and user.js is an example model file.



That's a brief overview of the folder structure in your project. Make sure to keep your README.md file up-to-date as your project evolves!








