FROM node:22.0.0

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY . .

EXPOSE 80
EXPOSE 443

CMD ["npm", "start"]
