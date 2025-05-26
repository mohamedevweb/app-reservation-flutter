# Entrepreneur Platform

A platform connecting entrepreneurs and investors, built with NestJS, TypeORM, and PostgreSQL.

## Description

Entrepreneur Platform is a RESTful API service that facilitates connections between entrepreneurs with innovative project ideas and potential investors. The platform allows entrepreneurs to showcase their projects while providing investors with opportunities to discover and invest in promising ventures.

## Features

- User authentication and authorization with JWT
- Role-based access control (entrepreneur, investor, admin)
- Project management for entrepreneurs
- Investment tracking for investors
- Interest-based matching between projects and investors
- Admin dashboard for platform oversight

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js with JWT
- **API Documentation**: Swagger
- **Containerization**: Docker & Docker Compose
- **Validation**: class-validator & class-transformer

## Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd entrepreneur-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Using Docker (Recommended)

Start the entire application stack (API and PostgreSQL) with Docker Compose:

```bash
docker-compose up -d
```

This will:

- Start a PostgreSQL database
- Build and start the NestJS application
- Make the API available at http://localhost:3000

### Without Docker

1. Make sure you have PostgreSQL running and update the database configuration in `src/config/database.config.ts`

2. Start the application:

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

This provides an interactive interface to explore and test all API endpoints.

## Project Structure

```
src/
├── admin/         # Admin module for platform administration
├── auth/          # Authentication module (JWT, guards, strategies)
├── config/        # Application configuration
├── interests/     # Interest management module
├── investments/   # Investment tracking module
├── projects/      # Project management module
├── users/         # User management module
├── app.module.ts  # Main application module
└── main.ts        # Application entry point
```

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [UNLICENSED License](LICENSE).

## Contact

Project Maintainer - [Your Name/Email]
