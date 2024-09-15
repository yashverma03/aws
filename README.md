## Links

- [Postman API collection](https://www.postman.com/yashverma03/learning/overview)
- [Docker image (frontend)](https://hub.docker.com/repository/docker/yashverma03/learning-frontend/general)
- [Docker image (backend)](https://hub.docker.com/repository/docker/yashverma03/learning-backend/general)

## Description

Learning new technologies:

- PostgresSQL
- Docker
- Kubernetes
- AWS

1. NodeJS backend with NestJS deployed on AWS EC2
   ![](https://github.com/user-attachments/assets/0fc5663e-b2d2-4db7-90d5-1b0d79d74a08)

2. PostgresSQL database deployed on AWS RDS
   ![](https://github.com/user-attachments/assets/9c6b64d9-e1fc-4d8f-822b-1659a2b16e06)

3. React frontend deployed on AWS S3
   ![](https://github.com/user-attachments/assets/7f9485f0-8d35-4849-b3e0-77c6e9d095bb)

4. React frontend served using AWS cloudfront for caching and faster delivery
   ![](https://github.com/user-attachments/assets/ad3a8607-634a-4eb8-98c0-c91615c855f1)

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
