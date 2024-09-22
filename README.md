# User Authentication API Boilerplate

This project is a boilerplate for an API that handles user creation and authentication. It provides a basic set of functionalities and endpoints to manage users and authentication tokens, built with Node.js and TypeScript.

## Features

- **User Registration:** Register new users with basic information.
- **Email Confirmation:** Verify user registration via a confirmation code.
- **User Login:** Authenticate users and issue JWT tokens.
- **Token Refresh:** Refresh JWT tokens using a refresh token.
- **User Logout:** Invalidate JWT tokens and log out users.
- **Google Authentication:** Log in using Google OAuth2.

## Tools and Technologies

This project utilizes a variety of tools and technologies to handle user authentication, data management, and infrastructure deployment:

### Backend

- **Node.js**: JavaScript runtime environment for building scalable network applications.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Fastify**: Web framework for building fast and low-overhead APIs.
- **AWS SDK**:
  - `@aws-sdk/client-dynamodb`: Client for interacting with DynamoDB.
  - `@aws-sdk/lib-dynamodb`: Helper library for DynamoDB operations.
  - `@aws-sdk/util-dynamodb`: Utilities for working with DynamoDB data types.
- **Fastify Plugins**:
  - `@fastify/aws-lambda`: Integration of Fastify with AWS Lambda.
  - `@fastify/cors`: CORS support for Fastify applications.
  - `@fastify/oauth2`: OAuth2 support for Fastify, used for SSO.
  - `@fastify/rate-limit`: Rate limiting middleware for Fastify.
- **JWT**:
  - `jsonwebtoken`: Library for generating and verifying JSON Web Tokens.
- **Validation**:
  - `zod`: TypeScript-first schema declaration and validation library.
  - `zod-to-json-schema`: Converts Zod schemas to JSON Schema format for use with Fastify.
- **Dependency Injection**:
  - `tsyringe`: Lightweight dependency injection container for TypeScript/JavaScript.
- **Utilities**:
  - `axios`: HTTP client for making API requests.
  - `env-var`: Library for parsing and validating environment variables.
  - `uuid`: Library for generating unique identifiers.
  - `reflect-metadata`: Library used for decorators and metadata reflection.
- **Logging**:
  - `winston`: Versatile logging library.

### Infrastructure

- **Terraform**: Infrastructure as Code (IaC) tool used to define and provision infrastructure using a high-level configuration language.

## Project Structure

The project is organized into several folders within the `src/` directory:

```bash
# Root files in `src/`
src/
├── constants.ts                       # Defines application-wide constants, such as fixed values or configuration settings.
├── container.ts                       # Configures and manages dependency injection using `tsyringe`.
├── lambda.ts                          # Entry point for serverless deployment, configuring the app to run as an AWS Lambda function.
├── main.ts                            # Main entry point of the application, responsible for bootstrapping the app.
├── server.ts                          # Contains the setup for the Fastify HTTP server.

# Custom type definitions
src/@types/
└── ...                                # Custom TypeScript type definitions and interfaces used throughout the application.

# External service integrations
src/adapters/
├── email/                             # Handles email-related functionalities like sending verification codes.
├── logger/                            # Logging service for tracking errors and activities.
└── unique-id/                         # Utility for generating unique identifiers.

# Configuration files for different parts of the application
src/configs/
├── dynamo.config.ts                   # Configuration for DynamoDB.
├── env.config.ts                      # Environment variables configuration.
├── jwt.config.ts                      # Configuration for generating and verifying JWT tokens.
├── rate-limit.config.ts               # Rate limiting configuration.
├── sso-google.config.ts               # Google SSO (Single Sign-On) configuration.
└── sso.config.ts                      # Centralized configuration for integrating multiple SSO providers.

# API request handlers and business logic
src/controllers/
├── auth.controller.ts                 # Handles authentication-related requests.
└── registration.controller.ts         # Handles user registration and confirmation.

# Custom error classes and handling
src/errors/
└── app.error.ts                       # Application-specific error classes.

# Reusable helper functions and utilities
src/helpers/
└── auth.helper.ts                     # Helper functions related to authentication.

# TypeScript interfaces for defining data structures
src/interfaces/
└── ...                                # Interfaces for data models and service responses.

# Middleware functions for request processing and validation
src/middlewares/
├── ensure-authenticated.middleware.ts # Ensures that a request is authenticated.
├── error-handling.middleware.ts       # Handles errors across the application.
└── request-audit.middleware.ts        # Logs and audits incoming requests.

# Data access logic and abstractions
src/repositories/
├── email-template.repository.ts       # Manages storage and retrieval of email templates.
├── session.repository.ts              # Handles data related to user sessions.
├── user-auth-provider.repository.ts   # Manages user authentication providers.
├── user.repository.ts                 # Handles operations related to user data.
└── verification-code.repository.ts    # Manages verification codes for email confirmation.

# Route definitions and endpoint configurations for the API
src/routers/
├── app.router.ts                      # Registers all routes, including general and module-specific routes like /health.
├── auth.router.ts                     # Routes related to authentication (login, logout, etc.).
└── registration.router.ts             # Routes for user registration and email confirmation.

# Validation schemas for request payloads using Zod
src/schemas/
├── login.schema.ts                    # Validates the payload for the login request.
├── login-confirm.schema.ts            # Validates the payload for confirming a login.
├── login-refresh.schema.ts            # Validates the payload for refreshing JWT tokens.
├── registration.schema.ts             # Validates the payload for user registration.
└── registration-confirm.schema.ts     # Validates the payload for confirming user registration.

# Core business logic and reusable services
src/services/
├── login.service.ts                   # Validates user and sends a verification code to the user's email for login confirmation.
├── login-confirm.service.ts           # Manages the confirmation of user login using the verification code.
├── logout.service.ts                  # Manages user logout operations, including token invalidation.
├── refresh-login.service.ts           # Handles the process of refreshing access tokens using a refresh token.
├── registration.service.ts            # Handles user registration, sends a verification code to the user's email for account confirmation.
├── registration-confirm.service.ts    # Creates the user account in the system after successful verification.
└── single-sign-on.service.ts          # Manages the SSO (Single Sign-On) processes for different providers.
```

## Infra

Infrastructure setup using [Terraform](https://www.terraform.io/) and deployment scripts.

```bash
infra/
├── backend/                      # Infrastructure configuration for backend services
│   ├── main.tf                   # Main Terraform configuration file for backend resources.
│   └── outputs.tf                # Specifies the outputs for backend resources, exporting useful information.

├── lambda/                       # Infrastructure configuration for AWS Lambda functions
│   ├── backend.tf                # Terraform configuration for deploying the Lambda function and its resources.
│   ├── main.tf                   # Main Terraform configuration file for the Lambda function setup.
│   ├── outputs.tf                # Specifies the outputs for the Lambda function, exporting useful information.
│   ├── variables.tf              # Variables used in the Lambda configuration.
│   ├── env/                      # Environment-specific configurations for Lambda functions
│   │   ├── dev.s3.tfbackend      # S3 backend configuration for storing the Terraform state file in the dev environment.
│   │   ├── dev.tfvars            # Variables specific to the dev environment.
│   │   ├── prod.s3.tfbackend     # S3 backend configuration for storing the Terraform state file in the prod environment.
│   │   └── prod.tfvars           # Variables specific to the prod environment.
│   └── layers/                   # Contains configurations for Lambda layers
│       └── nodejs/               # Node.js Lambda layer dependencies (e.g., npm packages)
│           ├── package.json      # Node.js package dependencies for the Lambda layer.
│           └── package-lock.json # Lock file for the Node.js dependencies.

└── scripts/                      # Deployment scripts for automating the infrastructure setup
    ├── deploy-backend.sh         # Shell script for deploying backend infrastructure using Terraform.
    └── deploy-lambda.sh          # Shell script for deploying Lambda functions and their configurations using Terraform.
```

## Environment Variables

This project relies on a set of environment variables to configure various aspects of the application. Below is a comprehensive list of these variables, their descriptions, and default values (if any).

| Variable Name                       | Required | Default Value                | Description                                                                 |
|-------------------------------------|----------|------------------------------|-----------------------------------------------------------------------------|
| `NODE_ENV`                          | No       | `production`                 | Defines the environment the application is running in (`development`, `production`). |
| `STAGE`                             | No       | `prod`                       | Indicates the stage of deployment (`dev`, `prod`).                          |
| `IS_DEBUG`                          | No       | Derived from `NODE_ENV` and `STAGE` | Boolean value indicating if debug mode is enabled.                          |
| `PORT`                              | No       | `8080`                       | Port on which the application will run.                                     |
| `CORS_ORIGIN`                       | No       | `*`                          | Specifies the allowed origins for CORS requests.                            |
| `JWT_SECRET`                        | Yes      | -                            | Secret key used for signing JWT tokens.                                     |
| `JWT_SECRET_VERIFICATION_TOKEN`     | Yes      | -                            | Secret key used specifically for verification tokens.                       |
| `APPLICATION_BASE_URL`              | Yes      | -                            | Base URL of the application.                                                |
| `FRONTEND_CONFIRM_SIGN_UP_URL`      | Yes      | -                            | URL for confirming user sign-up.                                            |
| `FRONTEND_CONFIRM_SIGN_IN_URL`      | Yes      | -                            | URL for confirming user sign-in.                                            |
| `RATE_LIMIT_MAX`                    | No       | `60`                         | Maximum number of requests allowed within the time window.                  |
| `RATE_LIMIT_TIME_WINDOW_MS`         | No       | `60000` (1 minute)           | Time window for rate limiting in milliseconds.                              |
| `AWS_REGION`                        | No       | `us-east-1`                  | AWS region for DynamoDB and other AWS services.                             |
| `AWS_DYNAMO_TABLE_NAME`             | Yes      | -                            | Name of the DynamoDB table used by the application.                         |
| `GOOGLE_CLIENT_SECRET`              | Yes      | -                            | Google OAuth client secret for authentication.                              |
| `GOOGLE_CLIENT_ID`                  | Yes      | -                            | Google OAuth client ID for authentication.                                  |
| `GOOGLE_SSO_ENABLED`                | No       | `false`                       | Boolean value indicating if Google SSO is enabled.                          |
| `EMAIL_PROVIDER`                    | No       | `resend`                     | Specifies the email provider to be used (`Resend`, etc.).                   |
| `DEFAULT_SENDER_EMAIL`              | Yes      | -                            | Default email address used for sending emails.                              |
| `RESEND_API_KEY`                    | Required if `EMAIL_PROVIDER` is `resend` | - | API key for Resend email provider.                                          |
| `UNIQUE_ID_PROVIDER`                | No       | `uuid`                       | Unique ID generation provider (`Uuid`, etc.).                               |
| `LOGGER_PROVIDER`                   | No       | `winston`                    | Logger provider used for logging (`Winston`, etc.).                         |
| `LOG_LEVEL`                         | No       | `info` or `debug` (if `IS_DEBUG` is true) | Log level for application logs (`info`, `debug`, etc.).            |
