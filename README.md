# User Authentication API Boilerplate

This project is a boilerplate for an API that handles user creation and authentication. It provides a basic set of functionalities and endpoints to manage users and authentication tokens, built with Node.js and TypeScript.

## Features

- **User Registration:** Register new users with basic information.
- **Email Confirmation:** Verify user registration via a confirmation code.
- **User Login:** Authenticate users and issue JWT tokens.
- **Token Refresh:** Refresh JWT tokens using a refresh token.
- **User Logout:** Invalidate JWT tokens and log out users.
- **Google Authentication:** Log in using Google OAuth2.

## Project Structure

The project is organized into several folders within the `src/` directory:

**`src/`**:

- `constants.ts`: Defines application-wide constants, such as fixed values or configuration settings used across different parts of the system.
- `container.ts`: Configures and manages dependency injection using `tsyringe`.
- `lambda.ts`: Entry point for serverless deployment, configuring the application to run as an AWS Lambda function.
- `main.ts`: Main entry point of the application, responsible for bootstrapping the app, setting up configurations.
- `server.ts`: Contains the setup for the Fastify HTTP server.

**`src/@types/`**: Custom TypeScript type definitions and interfaces used throughout the application.

**`src/adapters/`**: Integrations with external services, such as:

- `email/`: Sending email verification codes.
- `logger/`: Logging service for tracking errors and activities.
- `unique-id/`: Utility for generating unique identifiers.

**`src/configs/`**: Configuration files for different parts of the application, such as:

- `dynamo.config.ts`: Configuration for DynamoDB.
- `env.config.ts`: Environment variables configuration.
- `jwt.config.ts`: Configuration for generating and verifying JWT tokens.
- `rate-limit.config.ts`: Rate limiting configuration.
- `sso-google.config.ts`: Google SSO (Single Sign-On) configuration.
- `sso.config.ts`: Centralized configuration for integrating multiple SSO providers (e.g., Google, GitHub, Facebook, Apple) into the application.

**`src/controllers/`**: Logic for handling API requests and coordinating between services.

- `auth.controller.ts`: Handles authentication-related requests.
- `registration.controller.ts`: Handles user registration and confirmation.

**`src/errors/`**: Custom error classes and error handling utilities.

- `app.error.ts`: Application-specific error classes.
  
**`src/helpers/`**: Reusable helper functions and utilities.

- `auth.helper.ts`: Helper functions related to authentication.

**`src/interfaces/`**: TypeScript interfaces for defining data structures used across the application.

**`src/middlewares/`**: Middleware functions for request processing and validation.

- `ensure-authenticated.middleware.ts`: Ensures that a request is authenticated.
- `error-handling.middleware.ts`: Handles errors across the application.
- `request-audit.middleware.ts`: Logs and audits incoming requests.

**`src/repositories/`**: Contains data access logic and abstraction for managing various entities within the application.

- `email-template.repository.ts`: Manages storage and retrieval of email templates used in the application.
- `session.repository.ts`: Handles data related to user sessions, such as active sessions and session management.
- `user-auth-provider.repository.ts`: Manages user authentication providers (e.g., Email, Google, Facebook) linked to users.
- `user.repository.ts`: Handles operations related to user data, such as creating and retrieving user information.
- `verification-code.repository.ts`: Manages the lifecycle of verification codes used for email confirmation or other verification purposes.

**`src/routers/`**: Defines the endpoints and their corresponding handlers for the API.

- `app.router.ts`: Central router that registers all routes, including module-specific routes (auth, registration) and general routes like /health for health checks or other endpoints that don't belong to a specific module.
- `auth.router.ts`: Routes related to authentication, including login, logout, and token refresh.
- `registration.router.ts`: Routes for user registration and email confirmation.

**`src/schemas/`**: Validation schemas for request payloads using a schema validation library [Zod](https://github.com/colinhacks/zod)  and is converted into a Fastify-compatible format using [Zod to Json Schema](https://github.com/StefanTerdell/zod-to-json-schema).

- `login.schema.ts`: Validates the payload for the login request.
- `login-confirm.schema.ts`: Validates the payload for confirming a login.
- `login-refresh.schema.ts`: Validates the payload for refreshing JWT tokens using a refresh token.
- `registration.schema.ts`: Validates the payload for user registration, ensuring required fields like name and email are present.
- `registration-confirm.schema.ts`: Validates the payload for confirming user registration using a verification code.

- **`src/services/`**: Implements the core business logic of the application, handling complex processes and interactions between different parts of the system. Each service is focused on a specific functionality:

- `login.service.ts`: Validates user and sends a verification code to the user's email for login confirmation.
- `login-confirm.service.ts`: Manages the confirmation of user login using the verification code received via email.
- `logout.service.ts`: Manages user logout operations, including token invalidation.
- `refresh-login.service.ts`: Handles the process of refreshing access tokens using a refresh token.
- `registration.service.ts`: Handles user registration, sends a verification code to the user's email for account confirmation.
- `registration-confirm.service.ts`: Creates the user account in the system after successful verification of the confirmation code.
- `single-sign-on.service.ts`: Manages the SSO (Single Sign-On) processes for different providers (e.g., Google, GitHub).

## Infra Structure

WIP
