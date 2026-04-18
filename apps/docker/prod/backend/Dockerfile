FROM node:25-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

COPY . .
COPY .env.docker .env

RUN npm run prod:build


FROM node:25-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY ./shared ./shared
COPY ./prisma ./prisma
COPY --from=builder /app/out ./out


EXPOSE 3000
RUN npx drizzle-kit push

ENTRYPOINT npm
CMD run prod:start