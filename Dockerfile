FROM node:22-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install -g corepack@latest \
  && corepack pnpm install --frozen-lockfile \
  && corepack pnpm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
