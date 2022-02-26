FROM node:14-alpine
COPY ./ /app/
WORKDIR /app
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]
