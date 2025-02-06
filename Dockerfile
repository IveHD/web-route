# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
# Use the Node.js image as the base image for building
FROM node:14-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Node.js image for the final build
FROM node:14-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Command to run the application
CMD ["node", "dist/index.js"]
