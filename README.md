# Blog Platform

This project is a simple blog platform built using Node.js, Express, PostgreSQL, and JWT for authentication. It consists of the following services:

- **User Service**: Handles user authentication and profile management.
- **Blog Service**: Manages blog posts.
- **Comment Service**: Handles comments for blog posts.
- **Database Service**: PostgreSQL database for storing data.

## Table of Contents

- [Project Overview](#project-overview)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Running Locally with Docker Compose](#running-locally-with-docker-compose)
- [Deployment Guide](#deployment-guide)
- [Live Deployment](#live-deployment)
- [API Documentation](#api-documentation)

---

## Project Overview

This project is a simple blog platform consisting of four services:

### User Service

- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate a user.
- **GET** `/users/<id>`: Retrieve user details.
- **PUT** `/users/<id>`: Edit an existing user profile.
- **DELETE** `/users/<id>`: Delete a user profile.

### Blog Service

- **POST** `/blogs`: Create a new blog post.
- **GET** `/blogs`: List all blog posts (pagination supported).
- **GET** `/blogs/<id>`: Fetch a specific blog post.
- **PUT** `/blogs/<id>`: Edit an existing blog post.
- **DELETE** `/blogs/<id>`: Delete a specific blog post.

### Comment Service

- **POST** `/comments`: Add a comment to a blog post.
- **GET** `/comments?post_id=<id>`: List comments for a specific blog post.

### Database Service

- Uses **PostgreSQL** to store data for all services. Each service uses its own schema to maintain separation of concerns.

---

## Local Development Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **Docker** and **Docker Compose** (for running the application with PostgreSQL locally)

### Running Locally with Docker Compose

1. Clone the repository:

   ```bash
   git clone https://github.com/sattwikranjan/Blog.git
   cd blog-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a .env file in the project root and add the following:

   ```bash
    POSTGRES_USER=<Your_user>
    POSTGRES_PASSWORD=<Your_password>
    POSTGRES_DB=<Your_platform>

    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=<Your_db>
   ```

4. Build and run the services using Docker Compose:
   ```bash
    docker-compose --env-file .env up --build
   ```
5. Access the application at

   http://localhost:3001 for User Service.

   http://localhost:3002 for Blog Service.

   http://localhost:3003 for Comment Service.

6. If it fails run
   ```bash
   psql -h localhost -U <Your_user> -d <Your_db>
   ```
   ```mysql
   CREATE DATABASE <Your_platform>;
   CREATE USER <Your_user> WITH ENCRYPTED PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE <Your_platform> TO <Your_user>;
   ```

## Deployment Guide

To deploy the application on AWS EC2 with PostgreSQL running on the same EC2 instance:

1. Set up an AWS Instance

   - Launch an EC2 instance (preferably Amazon Linux 2 or Ubuntu).

   - Open the necessary ports in the security group:

     - Port 80 (HTTP)
     - Port 443 (HTTPs)
     - Port 5432 (PostgreSQL)
     - Ports for your API services (e.g., 3001, 3002, 3003).

2. Install PostgreSQL on EC2:

   SSH into your EC2 instance and install PostgreSQL:

   ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
   ```

3. Start and enable PostgreSQL:

   ```bash
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
   ```

4. Configure PostgreSQL:

   Edit postgresql.conf to listen on all IP addresses:

   ```bash
    sudo nano /etc/postgresql/16/main/postgresql.conf
   ```

   Change listen_addresses to '\*':

   ```bash
    listen_addresses = '*'
   ```

   Edit pg_hba.conf to allow external connections:

   ```bash
    sudo nano /etc/postgresql/12/main/pg_hba.conf
   ```

   Add this line for remote connections (or limit to specific IP addresses):

   ```bash
   host    all             all             0.0.0.0/0               md5

   ```

   Restart PostgreSQL:

   ```bash
   sudo systemctl restart postgresql
   ```

5. Create Database and User:
   Connect to PostgreSQL and create the required database and user:
   ```bash
    psql -h <EC2-Public-IP> -U <username> -d <database_name>
   ```
   ```sql
   CREATE DATABASE <Your_platform>;
   CREATE USER <Your_user> WITH ENCRYPTED PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE <Your_platform> TO <Your_user>;
   \q
   ```
6. Set up the .env.production file:

   SSH into your EC2 instance and create a .env.production file in the project directory with the following configuration:

   ```bash
    POSTGRES_USER=<Your_user>
    POSTGRES_PASSWORD=<Your_password>
    POSTGRES_DB=<Your_platform>

    DB_HOST=<EC2 Instance>
    DB_PORT=5432
    DB_NAME=<Your_platform>
   ```

7. Clone the Repository on EC2:

   ```bash
    git clone https://github.com/sattwikranjan/Blog.git
    cd Blog
   ```

8. Install Docker and Docker Compose (if not installed):

   ```bash
    sudo apt install docker.io
    sudo apt install docker-compose

   ```

9. Run the Application:
   Use Docker Compose to build and run the services:
   ```bash
    docker-compose --env-file .env.production up --build
   ```

## Live Deployment

- The application is now live and can be accessed using HTTPS at:
  ```vbnet
    http://ec2-13-60-240-133.eu-north-1.compute.amazonaws.com
  ```
- The application is secured using SSL/TLS certificates from Let's Encrypt.
- You can access the different services via these endpoints:
  - User Service: http://ec2-13-60-240-133.eu-north-1.compute.amazonaws.com:3001
  - Blog Service: http://ec2-13-60-240-133.eu-north-1.compute.amazonaws.com:3002
  - Comment Service: http://ec2-13-60-240-133.eu-north-1.compute.amazonaws.com:3003

## API Documentation

### 1. User Service

The User Service manages user authentication and profile management. The API uses JWT for authentication, and bcrypt for password security.

#### 1.1 Register a New User

**POST** `/api/register`

Registers a new user with a username, email, and password.

**Request Body**:

```json
{
  "username": "exampleuser",
  "email": "example@example.com",
  "password": "yourpassword"
}
```

**Resoponse**:

- 201 Created:

  ```json
  {
    "id": 1
  }
  ```

- 400 Bad Request:
  ```json
  {
    "error": "Some error message"
  }
  ```

#### 1.2 Login User

**POST** `/login`

**Request Body**:

```json
{
  "email": "example@example.com",
  "password": "yourpassword"
}
```

**Resoponse**:

- 200 OK:

  ```json
  {
    "token": "your_jwt_token"
  }
  ```

- 401 Unauthorized:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

#### 1.3 Get User Details

**POST** `/users/:id`

Retrieves user details by user ID. This is a protected route that requires authentication via JWT.
**Request**:

- URL Parameter: id (User ID to retrieve)

**Resoponse**:

- 200 OK:

  ```json
  {
    "id": 1,
    "username": "exampleuser",
    "email": "example@example.com"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "User not found"
  }
  ```

#### 1.4 Update User Details

**PUT** `/users/:id`

Allows an authenticated user to update their username and email.
**Request**:

- URL Parameter: id (User ID to retrieve)
- Request Body:
  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com"
  }
  ```
- Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 200 OK:

  ```json
  {
    "id": 1,
    "username": "newusername",
    "email": "newemail@example.com"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "User not found"
  }
  ```

#### 1.5 Delete User Details

**DELETE** `/users/:id`

Allows an authenticated user to update their username and email.
**Request**:

- Deletes a specific user from the system.
- Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 200 OK:

  ```json
  {
    "message": "User deleted"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "User not found"
  }
  ```

### 2. Blog Service

The Blog Service handles blog posts and supports pagination.

#### 2.1 Create a New Blog Post

**POST** `/blogs`

Creates a new blog post. Requires JWT authentication.

**Request Body**:

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of the blog post."
}
```

Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 201 Created:

  ```json
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the content of the blog post.",
    "author_id": 1,
    "created_at": "2025-01-05T00:00:00Z",
    "updated_at": "2025-01-05T00:00:00Z"
  }
  ```

- 401 Unauthorized:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

#### 2.2 List All Blog Posts

**GET** `/blogs`

Retrieves a paginated list of all blog posts.

**_Query Parameters:_**

- page: The page number (default is 1).
- limit: The number of posts per page (default is 10).

**Resoponse**:

- 200 OK:

  ```json
  [
    {
      "id": 1,
      "title": "My First Blog Post",
      "content": "This is the content of the blog post.",
      "author_id": 1,
      "created_at": "2025-01-05T00:00:00Z",
      "updated_at": "2025-01-05T00:00:00Z"
    },
    {
      "id": 2,
      "title": "My Second Blog Post",
      "content": "This is the content of another blog post.",
      "author_id": 2,
      "created_at": "2025-01-06T00:00:00Z",
      "updated_at": "2025-01-06T00:00:00Z"
    }
  ]
  ```

#### 2.3 Get Specific Blog Post

**GET** `/blogs/:id`

Retrieves a specific blog post by its ID.
**Request**:

- URL Parameter: id (Blog ID to retrieve)

**Resoponse**:

- 200 OK:

  ```json
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the content of the blog post.",
    "author_id": 1,
    "created_at": "2025-01-05T00:00:00Z",
    "updated_at": "2025-01-05T00:00:00Z"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "Blog post not found"
  }
  ```

#### 2.4 Update Blog Post

**PUT** `/blogs/:id`

Updates an existing blog post. Requires JWT authentication.
**Request**:

- URL Parameter: id (Blog ID to retrieve)
- Request Body:
  ```json
  {
    "title": "Updated Blog Post Title",
    "content": "Updated content of the blog post."
  }
  ```
- Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 200 OK:

  ```json
  {
    "id": 1,
    "title": "Updated Blog Post Title",
    "content": "Updated content of the blog post.",
    "author_id": 1,
    "created_at": "2025-01-05T00:00:00Z",
    "updated_at": "2025-01-06T00:00:00Z"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "Blog post not found"
  }
  ```

#### 2.5 Delete Blog Post

**DELETE** `/blogs/:id`

Deletes a specific blog post. Requires JWT authentication.
**Request**:

- Deletes a specific blog from the system.
- Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 200 OK:

  ```json
  {
    "message": "Blog post deleted"
  }
  ```

- 404 Not Found:
  ```json
  {
    "error": "Blog post not found"
  }
  ```

### 3. Comment Service

The Comment Service manages comments on blog posts.

#### 3.1 Create a New Blog Post

**POST** `/comments`

Adds a comment to a blog post. Requires JWT authentication.

**Request Body**:

```json
{
  "post_id": 1,
  "content": "This is a comment."
}
```

Authorization Header: Authorization: Bearer <JWT_token>

**Resoponse**:

- 201 Created:

  ```json
  {
    {
    "id": 1,
    "post_id": 1,
    "author_id": 1,
    "content": "This is a comment.",
    "created_at": "2025-01-05T00:00:00Z"
    }
  }
  ```

- 401 Unauthorized:
  ```json
  {
    "error": "Unauthorized"
  }
  ```

#### 3.2 Get Comments for a Post

**GET** `/comments?post_id`

Retrieves all comments for a specific blog post.

**_Query Parameters:_**

- post id

**Resoponse**:

- 200 OK:

  ```json
  [
    {
      "id": 1,
      "post_id": 1,
      "author_id": 1,
      "content": "This is a comment.",
      "created_at": "2025-01-05T00:00:00Z"
    },
    {
      "id": 2,
      "post_id": 1,
      "author_id": 2,
      "content": "Another comment.",
      "created_at": "2025-01-05T01:00:00Z"
    }
  ]
  ```
