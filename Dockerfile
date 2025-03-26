# 1) Build stage
FROM node:18-alpine AS build

# Create and set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's files and build
COPY . .
RUN npm run build

# 2) Production stage (Nginx)
FROM nginx:alpine

# Copy build output from the first stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Cloud Run will route traffic to this port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

