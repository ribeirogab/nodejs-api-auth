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

```bash
# Root files in `src/`
src/
├── constants.ts               # Defines application-wide constants, such as fixed values or configuration settings.
├── container.ts               # Configures and manages dependency injection using `tsyringe`.
├── lambda.ts                  # Entry point for serverless deployment, configuring the app to run as an AWS Lambda function.
├── main.ts                    # Main entry point of the application, responsible for bootstrapping the app.
├── server.ts                  # Contains the setup for the Fastify HTTP server.

# Custom type definitions
src/@types/
└── ...                        # Custom TypeScript type definitions and interfaces used throughout the application.

# External service integrations
src/adapters/
├── email/                     # Handles email-related functionalities like sending verification codes.
├── logger/                    # Logging service for tracking errors and activities.
└── unique-id/                 # Utility for generating unique identifiers.

# Configuration files for different parts of the application
src/configs/
├── dynamo.config.ts           # Configuration for DynamoDB.
├── env.config.ts              # Environment variables configuration.
├── jwt.config.ts              # Configuration for generating and verifying JWT tokens.
├── rate-limit.config.ts       # Rate limiting configuration.
├── sso-google.config.ts       # Google SSO (Single Sign-On) configuration.
└── sso.config.ts              # Centralized configuration for integrating multiple SSO providers.

# API request handlers and business logic
src/controllers/
├── auth.controller.ts         # Handles authentication-related requests.
└── registration.controller.ts # Handles user registration and confirmation.

# Custom error classes and handling
src/errors/
└── app.error.ts               # Application-specific error classes.

# Reusable helper functions and utilities
src/helpers/
└── auth.helper.ts             # Helper functions related to authentication.

# TypeScript interfaces for defining data structures
src/interfaces/
└── ...                        # Interfaces for data models and service responses.

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
├── app.router.ts               # Registers all routes, including general and module-specific routes like /health.
├── auth.router.ts              # Routes related to authentication (login, logout, etc.).
└── registration.router.ts      # Routes for user registration and email confirmation.

# Validation schemas for request payloads using Zod
src/schemas/
├── login.schema.ts             # Validates the payload for the login request.
├── login-confirm.schema.ts     # Validates the payload for confirming a login.
├── login-refresh.schema.ts     # Validates the payload for refreshing JWT tokens.
├── registration.schema.ts      # Validates the payload for user registration.
└── registration-confirm.schema.ts # Validates the payload for confirming user registration.

# Core business logic and reusable services
src/services/
├── login.service.ts            # Validates user and sends a verification code to the user's email for login confirmation.
├── login-confirm.service.ts    # Manages the confirmation of user login using the verification code.
├── logout.service.ts           # Manages user logout operations, including token invalidation.
├── refresh-login.service.ts    # Handles the process of refreshing access tokens using a refresh token.
├── registration.service.ts     # Handles user registration, sends a verification code to the user's email for account confirmation.
├── registration-confirm.service.ts # Creates the user account in the system after successful verification.
└── single-sign-on.service.ts   # Manages the SSO (Single Sign-On) processes for different providers.
```

## Infra Structure

WIP
