# base image
FROM node:14

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# COPY package.json /app/package.json
RUN npm install
RUN npm install @vue/cli@4.5.11 -g

COPY . .

# start app
CMD ["npm", "run", "serve"]

EXPOSE 8081