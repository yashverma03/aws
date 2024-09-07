# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the application code
COPY ./ ./

# Copy the .env.example file and rename it to .env
COPY .env.example .env

# Install dependencies
RUN npm ci

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using a nginx web server
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the .env file
COPY --from=build /app/.env /usr/share/nginx/html/.env

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
