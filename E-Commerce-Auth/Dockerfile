#use the official Node.js image as the base image
FROM node:18

#set the working directory inside the container
WORKDIR /app

#copy package.json and package-lock.json to the working directory
COPY package*.json ./

#Install dependencies
RUN npm install

#copy to working dir
COPY . .

#expose port
EXPOSE 5000

#commands to run the app
CMD ["node", "app.js"]
