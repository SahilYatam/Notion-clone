# Project Structure Documentation

## Overview
This document provides a clear explanation of the project structure, so that anyone can easily navigate and understand different modules.

---

## Folder Structure Diagram

```plaintext
service-name/
└── src/
    ├── domain/
    │   ├── services/
    │   └── validators/
    ├── infrastructure/
    │   ├── db/
    │   ├── email/
    │   ├── middlewares/
    │   └── models/ (only in notes-service)
    ├── interface/
    │   ├── controllers/
    │   └── routers/
    └── utils/

```

### Common Structure

#### domain
- `services/` → Contains business logic.
- `validators/` → Contains Joi schemas for input validation.

#### infrastructure
- `db/` → Handles database connection logic.
- `email/` → Handles email-related functionality such as Nodemailer configuration and email services.
- `middlewares/` → Handles authentication and other middleware (e.g., `auth-middleware.js`).

#### interface
- `controllers/` → Contains request/response handler files.
- `routers/` → Defines API routes and connects them with controllers.

### utils
- `utils/` → Contains helper/utility functions.


### Service-Specific Notes
- **Note Service** → Includes a `models/` folder inside `infrastructure/` for database models.

---

## Shared Folder Structure Diagram

```plaintext
shared/
├── error-monitoring/
├── Infrastructure/
├── node_modules/
├── utils/
```


### error-monitoring
- `sentry/` → Contains configuration for Sentry.io, an error monitoring and alerting tool used to capture application errors.

### infrastructure
- `cloudinary/` → Contains Cloudinary configuration and utility files.
- `factories/` → Contains `expressAppFactory.js` to create an Express app instance.
- `middleware/` → 
  - `globalErrorHandler.js` → Handles global errors.  
  - `validation.middleware.js` → Handles input validation using Joi schemas.  
  - `verifyToken.middleware.js` → Handles user authorization.
- `multer/` → Contains Multer configuration and middleware for file uploads.

### server
- `server/` → Contains `createServer.js` to set up the server.

### utils
- `ApiError.js` → Custom API error handling.  
- `ApiResponse.js` → Standardized API output handling.  
- `asyncHandler.js` → Utility for handling async errors.  
- `logger.js` → Utility for logging information, errors, and warnings.




