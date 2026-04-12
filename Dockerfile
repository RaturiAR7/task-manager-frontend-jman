FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

# copy application files from the build context
COPY . .

# build the Next.js app
RUN npm run build

# Next.js defaults to port 3000
EXPOSE 3000

# start the Next.js server
CMD ["npm","run","start"]