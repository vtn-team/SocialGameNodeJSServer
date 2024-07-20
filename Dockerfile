FROM node:20-bullseye-slim as builder

WORKDIR /app
COPY . /app/apiServer/

WORKDIR /app/apiServer
RUN npm ci
RUN npx tsc
RUN rm -rf node_modules
RUN npm ci --omit=dev

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# final image
FROM gcr.io/distroless/nodejs20-debian11:nonroot

COPY --from=builder /app/apiServer/js /usr/app/js
COPY --from=builder /app/apiServer/json /usr/app/json
COPY --from=builder /app/apiServer/node_modules /usr/app/node_modules

COPY --from=builder /tini /tini

ENTRYPOINT ["/tini", "--"]

#USER nonroot:nonroot
WORKDIR /usr/app

ENV PATH $PATH:/nodejs/bin
EXPOSE 80

CMD ["node", "/usr/app/js/main.js"]
