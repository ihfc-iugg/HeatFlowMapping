# specify the node base image with your desired version node:<version>
FROM node:20 AS build-stage
# replace this with your application's default port
# EXPOSE 8888

ENV NODE_OPTIONS="--max-old-space-size=4096"

# add app dir to container
WORKDIR /app

# copy node packe file and install 
COPY package*.json ./
RUN npm install

# copy rest of project
COPY . .

# build app within container
RUN npm run build

# copy from previos stage only dist/
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# default port for nginx
EXPOSE 80

#
CMD [ "nginx", "-g", "daemon off;" ]