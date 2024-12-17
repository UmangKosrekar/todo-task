# Node.js To-Do Application

A scalable RESTful API for managing a to-do list with user authentication and CI/CD deployment.

## Features
- **JWT Authentication** with role-based access control.
- **CRUD Operations** for to-do items (including pagination, filtering, and sorting).
- **Rate limiting** and input sanitization middleware.
- **CI/CD Pipeline** with GitHub Actions to deploy on AWS Elastic Beanstalk.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Configure MongoDB connection in `config/db.js`.
4. Run `npm start` to launch the API.

## CI/CD Pipeline
1. Add AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) and environment settings to GitHub secrets.
2. Push code to the `master` branch to trigger the pipeline.

---
