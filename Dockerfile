FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm","run","test:cv"]
