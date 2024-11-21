# Base image
FROM node:latest

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
