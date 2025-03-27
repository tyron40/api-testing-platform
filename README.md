# API Testing Platform

A comprehensive automated API testing platform built with React and Node.js that enables teams to create, manage, and automate API tests with ease. The platform supports both RESTful and GraphQL APIs, featuring test generation, scheduling, and detailed reporting capabilities.

![screencapture-visionary-praline-e407fb-netlify-app-2025-03-27-17_15_25](https://github.com/user-attachments/assets/f98fba39-d8de-400b-908c-270ca5f4e483)
![screencapture-visionary-praline-e407fb-netlify-app-test-builder-2025-03-27-17_15_48](https://github.com/user-attachments/assets/057c7d3d-671f-49e4-b6db-619ebb99e5b9)
![screencapture-visionary-praline-e407fb-netlify-app-test-results-2025-03-27-17_16_09](https://github.com/user-attachments/assets/9fedb169-5431-486e-8804-0299ec7b7e57)
![screencapture-visionary-praline-e407fb-netlify-app-settings-2025-03-27-17_16_23](https://github.com/user-attachments/assets/02cb2979-4e78-4d4b-9dd0-8c1036a5f192)

![API Testing Platform](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2000)

## Features

### Test Management
- **Visual Test Builder**: Intuitive interface for creating and editing API tests
- **Test Generation**: Automatically generate test cases from API specifications
- **Multi-Protocol Support**: Test both REST and GraphQL APIs
- **Environment Management**: Configure and switch between different environments
- **Variable Management**: Define and manage environment variables

### Test Execution
- **Automated Testing**: Schedule tests to run automatically
- **Real-time Execution**: Watch test execution in real-time
- **Parallel Execution**: Run multiple test suites simultaneously
- **Configurable Retries**: Automatically retry failed tests
- **Conditional Logic**: Add dynamic behavior to your tests

### Authentication Support
- JWT Authentication
- API Key Authentication
- Basic Authentication
- OAuth 2.0 Integration

### Monitoring & Reporting
- **Real-time Dashboard**: Monitor test execution and results
- **Detailed Reports**: Get comprehensive test execution reports
- **Performance Metrics**: Track API response times and reliability
- **Failure Analysis**: Detailed error reporting and debugging tools
- **Historical Data**: Track trends and patterns over time

### Security
- **Role-based Access**: Control user permissions
- **Secure Storage**: Encrypted storage for sensitive data
- **Audit Logging**: Track all system activities

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide Icons
- Axios

### Backend
- Node.js
- Express
- JWT Authentication
- Winston Logger
- Swagger UI

### Database
- MongoDB (configured but mocked for demo)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MongoDB (optional, mocked in demo)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/api-testing-platform.git
cd api-testing-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### Development

Start both frontend and backend servers:
```bash
npm run dev:all
```

Or start them separately:
```bash
# Frontend only
npm run dev

# Backend only
npm run server
```

### Building for Production

Build the application:
```bash
npm run build
```

### Docker Support

Run with Docker Compose:
```bash
docker-compose up
```

## Project Structure

```
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Application pages
│   └── utils/           # Utility functions
├── server/              # Backend Node.js application
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   └── utils/           # Utility functions
├── public/              # Static assets
└── docker/              # Docker configuration
```

## API Documentation

API documentation is available at `/api-docs` when the server is running. The documentation is generated using Swagger UI and provides detailed information about all available endpoints.

### Key Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login
  - GET `/api/auth/me` - Get current user

- **Test Suites**
  - GET `/api/test-suites` - List all test suites
  - POST `/api/test-suites` - Create new test suite
  - GET `/api/test-suites/:id` - Get test suite details
  - PUT `/api/test-suites/:id` - Update test suite
  - DELETE `/api/test-suites/:id` - Delete test suite
  - POST `/api/test-suites/:id/run` - Run test suite

- **Test Results**
  - GET `/api/test-results` - List all test results
  - GET `/api/test-results/:id` - Get test result details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
