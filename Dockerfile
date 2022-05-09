# FROM nginx:alpine

# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 8081
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf