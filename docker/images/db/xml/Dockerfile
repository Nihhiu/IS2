FROM postgres:16.1-alpine3.19

ENV POSTGRES_USER=is
ENV POSTGRES_PASSWORD=is
ENV POSTGRES_DB=is

COPY initial_schema.sql /docker-entrypoint-initdb.d/

EXPOSE 5432