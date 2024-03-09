# Use the official Node.js image with LTS version based on Debian Bullseye slim
FROM node:lts-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx expo export -p web
EXPOSE 3000
CMD ["node", "server.js"]
