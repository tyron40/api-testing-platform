export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API Testing Platform API',
    version: '1.0.0',
    description: 'API documentation for the API Testing Platform'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: {
                    type: 'string'
                  },
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string',
                    format: 'password'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User registered successfully'
          },
          '400': {
            description: 'Invalid input'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login a user',
        tags: ['Auth'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email'
                  },
                  password: {
                    type: 'string',
                    format: 'password'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User logged in successfully'
          },
          '400': {
            description: 'Invalid credentials'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/api/test-suites': {
      get: {
        summary: 'Get all test suites',
        tags: ['Test Suites'],
        responses: {
          '200': {
            description: 'List of test suites'
          },
          '401': {
            description: 'Unauthorized'
          },
          '500': {
            description: 'Server error'
          }
        }
      },
      post: {
        summary: 'Create a new test suite',
        tags: ['Test Suites'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'baseUrl'],
                properties: {
                  name: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  },
                  baseUrl: {
                    type: 'string'
                  },
                  apiType: {
                    type: 'string',
                    enum: ['REST', 'GraphQL']
                  },
                  steps: {
                    type: 'array',
                    items: {
                      type: 'object'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Test suite created'
          },
          '400': {
            description: 'Invalid input'
          },
          '401': {
            description: 'Unauthorized'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    }
  }
};