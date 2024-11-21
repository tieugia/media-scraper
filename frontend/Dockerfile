FROM node:23.1.0

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]
