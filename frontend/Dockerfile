FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies (if node_modules not mounted)
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
