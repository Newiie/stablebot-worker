FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock 

RUN bun install

COPY ./ ./

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile app \
	./src/app.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/app app
COPY --from=build /app/.env.local .
ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000