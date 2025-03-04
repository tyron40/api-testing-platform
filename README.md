# API Testing Platform

A comprehensive automated API testing platform for RESTful and GraphQL APIs with test generation and monitoring capabilities.

## Features

- **Automated Test Generation**: Automatically generate test cases from API specifications
- **Test Builder**: Visual interface for creating and editing API tests
- **Test Execution**: Run tests manually or on a schedule
- **Monitoring**: Track API performance and reliability over time
- **Reporting**: Detailed test results and analytics
- **Authentication**: Secure user accounts and API access

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`

### Development

Start the development server:

```bash
npm run dev:all
```

This will start both the frontend and backend servers.

### Docker

To run the application using Docker:

```bash
docker-compose up
```

## Project Structure

```
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Application pages
│   └── main.tsx          # Application entry point
├── server/               # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## License

MIT