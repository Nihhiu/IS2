CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS POSTGIS_TOPOLOGY;

CREATE TABLE public.countries (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    continent       VARCHAR(100) NOT NULL,
    iso_country     VARCHAR(3) UNIQUE NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.regions (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    iso_region      VARCHAR(10) UNIQUE NOT NULL,
    municipality   	VARCHAR(250),
    gps_code        VARCHAR(10),
    local_code      VARCHAR(10),
	country			uuid NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.airports (
    id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ident           VARCHAR(10) UNIQUE NOT NULL,
    type            VARCHAR(50),
    name            VARCHAR(250) NOT NULL,
    elevation_ft    INT,
    iata_code       VARCHAR(3),
    coordinates     GEOMETRY,
	region			uuid NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE public.regions
ADD CONSTRAINT fk_regions_countries
FOREIGN KEY (country)
REFERENCES public.countries(id)
ON DELETE CASCADE;

ALTER TABLE public.airports
ADD CONSTRAINT fk_airports_regions
FOREIGN KEY (region)
REFERENCES public.regions(id)
ON DELETE CASCADE;

/* Sample table and data that we can insert once the database is created for the first time */
CREATE TABLE public.teachers (
	name    VARCHAR (100),
	city    VARCHAR(100),
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO teachers(name, city) VALUES('Luís Teófilo', 'Porto');
INSERT INTO teachers(name, city) VALUES('Ricardo Castro', 'Braga');

