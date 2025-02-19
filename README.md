# Smart Ranks API

RESTful API backend for user, product, and invoice management system.

## Description

RESTful API built with NestJS that provides functionalities for:
- User management with roles (admin/user)
- Product management with inventory control
- Invoice generation and querying
- JWT authentication and role-based access control

## Technologies

- NestJS
- MongoDB
- JWT for authentication
- Swagger for documentation

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm

## Installation

1. Clone the repository:
```bash
git clone git@github.com:Barajudo/api-smart-ranks.git
cd api-smart-ranks
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

## Project Structure

```
src/
├── modules/          # Application modules
│   ├── auth/        # Authentication and authorization
│   ├── users/       # User management
│   ├── products/    # Product management
│   └── invoices/    # Invoice management
├── common/          # Shared code
└── config/          # Configurations
```

## API Documentation (Swagger)

The API documentation is available through Swagger UI at:
```
http://localhost:3000/docs
```

### Swagger Documentation Features:
- Interactive API testing interface
- Detailed endpoint descriptions
- Request and response schemas
- Authentication requirements
- Role-based access specifications

Example endpoints in Swagger:

1. Authentication:
   - POST /auth/login
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. Users:
   - POST /users
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "user"
   }
   ```

3. Products:
   - POST /products
   ```json
   {
     "name": "Product Name",
     "description": "Product Description",
     "price": 99.99,
     "stock": 100
   }
   ```

## Endpoints

### Authentication
- POST /api/auth/login - Login user

### Users
- POST /api/users - Create user
- GET /api/users - List users (admin)
- GET /api/users/:id - Get user
- PATCH /api/users/:id - Update user
- DELETE /api/users/:id - Delete user (admin)

### Products
- POST /api/products - Create product (admin)
- GET /api/products - List products
- GET /api/products/:id - Get product
- PATCH /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Invoices
- POST /api/invoices - Create invoice
- GET /api/invoices - List invoices
- GET /api/invoices/:id - Get invoice
- GET /api/invoices/user/:userId/monthly-purchases - Get monthly purchases

## Running the App

Development:
```bash
npm run start:dev
```

Production:
```bash
npm run build
npm run start:prod
```

## Access Control

- Regular users can:
  - View products
  - Create invoices
  - View their own invoices
  - Update their profile

- Administrators can:
  - Manage users
  - Manage products
  - View all invoices
  - Manage inventory

## Testing

To run tests:
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is under the MIT License.
