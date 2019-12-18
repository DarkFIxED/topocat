FROM node:alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && \
	echo -e "import * as GeoJSON from 'geojson';\n$(cat ./node_modules/terraformer/terraformer.d.ts)" > ./node_modules/terraformer/terraformer.d.ts && \
    npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/