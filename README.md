## Description

Learning new technologies:

- PostgresSQL
- Docker
- Kubernetes
- AWS

## Links

- [Postman API collection](https://www.postman.com/yashverma03/learning/overview)
- [Docker image (frontend)](https://hub.docker.com/repository/docker/yashverma03/learning-frontend/general)
- [Docker image (backend)](https://hub.docker.com/repository/docker/yashverma03/learning-backend/general)

## Installation

### Frontend

- Requirements- Node.js
- Create a .env file in frontend folder (refer to [.env.example](./frontend/.env.example))
- Open terminal in the project root directory and run the following commands:
  ```bash
  cd ./frontend
  ```
  ```bash
  npm ci
  ```
  ```bash
  npm start
  ```

### Backend

- Requirements- Node.js, PostgresSQL
- Create a .env file in backend folder (refer to [.env.example](./backend/.env.example))
- Create a database in PostgresSQL with the name specified in the .env file for the key `DB_DATABASE`
- Open terminal in the project root directory and run the following commands:
  ```bash
  cd ./backend
  ```
  ```bash
  npm ci
  ```
  ```bash
  npm run migration:run
  ```
  ```bash
  npm run start:dev
  ```
