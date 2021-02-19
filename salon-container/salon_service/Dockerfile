FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4010

CMD [ "npm", "start" ]

EXPOSE 4010