FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]