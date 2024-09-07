# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /learning/backend

# Copy the application code
COPY ./ ./

# Copy the .env.example file and rename it to .env
COPY .env.example .env

# Install dependencies
RUN npm ci

# Build the NestJS application
RUN npm run build

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
