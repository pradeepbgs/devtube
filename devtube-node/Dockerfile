# Use node 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /build

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

EXPOSE 3002
CMD ["npm","start"]
