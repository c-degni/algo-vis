# Using debina based node image
FROM node:20-bookworm
WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build-

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "server.js"]