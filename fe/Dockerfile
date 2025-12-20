FROM node:22-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps

ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_MAPTILES_KEY
ARG VITE_GOONG_API_KEY

ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_MAPTILES_KEY=$VITE_MAPTILES_KEY
ENV VITE_GOONG_API_KEY=$VITE_GOONG_API_KEY

COPY . .
RUN npm run build

FROM node:22-alpine
RUN npm i -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD [ "serve", "-s", "dist", "-p", "80" ]