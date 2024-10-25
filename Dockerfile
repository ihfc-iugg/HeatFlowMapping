# This dockerfile leverages multi-stage builds to create a lean production image.
# The first stage uses a node image to build the app. Once the app is built, the dist folder is copied to the second 
# stage which uses an nginx image to serve the app. A custom nginx configuration file is copied to the nginx image which
# allows the app to be served from a subpath of the root domain, where necessary. 

# specify the node base image with your desired version node:<version>

ARG NODE_VERSION=20

# ============== 1. BUILD STAGE ==============
FROM node:${NODE_VERSION} AS build-stage

ENV NODE_OPTIONS="--max-old-space-size=4096"

# specify the working directory
WORKDIR /app

# copy node package files and install dependencies
COPY package*.json ./
RUN npm install

# copy rest of project
COPY . .

# build app within container
RUN npm run build

# ============== 2. RUN STAGE ==============
FROM nginx:alpine AS run-stage

# Copy a custom Nginx configuration file if you need one (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# copy from previos stage only dist/
COPY --from=build-stage /app/dist /usr/share/nginx/html

# default port for nginx
EXPOSE 80

# the command to run nginx and serve the app
CMD [ "nginx", "-g", "daemon off;" ]