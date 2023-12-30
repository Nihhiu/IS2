CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS POSTGIS_TOPOLOGY;

CREATE TABLE public.teams (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.countries (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) UNIQUE NOT NULL,
	geom            GEOMETRY,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.players (
	id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	name            VARCHAR(250) NOT NULL,
	age             INT NOT NULL,
	team_id         uuid,
	country_id      uuid NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE players
    ADD CONSTRAINT players_countries_id_fk
        FOREIGN KEY (country_id) REFERENCES countries
            ON DELETE CASCADE;

ALTER TABLE players
    ADD CONSTRAINT players_teams_id_fk
        FOREIGN KEY (team_id) REFERENCES teams
            ON DELETE SET NULL;

/* Sample table and data that we can insert once the database is created for the first time */
CREATE TABLE public.teachers (
	name    VARCHAR (100),
	city    VARCHAR(100),
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO teachers(name, city) VALUES('Luís Teófilo', 'Porto');
INSERT INTO teachers(name, city) VALUES('Ricardo Castro', 'Braga');

