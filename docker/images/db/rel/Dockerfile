FROM postgis/postgis:16-3.4-alpine

ENV POSTGRES_USER=is
ENV POSTGRES_PASSWORD=is
ENV POSTGRES_DB=is

COPY initial_schema.sql /docker-entrypoint-initdb.d/

EXPOSE 5432