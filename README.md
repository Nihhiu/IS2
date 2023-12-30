# Systems Integration Development Kit #

### Introduction ###

This environment allows you to easily install the development environment and its dependencies.
This is to be used for the 2nd project in Systems Integration course from Informatics Engineering at IPVC/ESTG.

### How to I setup my development environment? ###

* Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Create an _.env_ file in the root folder of this codebase
* Create the necessary Docker Images and Containers by running the following command in the project's root folder:
```
docker-compose up --build -d
```
* *Note:* the **-d** flag intends to launch all the containers in background. If not used, all the containers will run attached to the same process.
* Once your are done working in the assignment, you can remove everything by running:
```
docker-compose down
```
* **NOTE:** once you run the command above, the data in the database will be reset if not stored in a volume. Consider stopping the container instead, if you want to keep the data.
```
# stops all the containers
docker-compose stop

# restarts all the containers 
docker-compose start
```

### Docker Images ###

#### PostgreSQL Database (xml) ####

* Available at localhost:10001 or db-xml:5432 within docker virtual network
  * **username**: is
  * **password**: is
  * **database**: is

#### PostgreSQL Database (rel) ####

* Available at localhost:10002 or db-rel:5432 within docker virtual network
* This database also installs PostGIS to allow for dealing with the geographical data
  * **username**: is
  * **password**: is
  * **database**: is

#### Python + node.js ####

* Python with pip
* node.js + nodemon (that can be used to easily reload apps)
* You can add additional pre-installed packages to the **_requirements.txt_** file. Remember that if you add any dependency, you will have to rebuild the Docker images again.
* The entrypoint of the container is the bash script named **run.sh**.
* You can easily use this python environment by opening up a terminal with the following command.
```
docker-compose run <name of the container that uses this image> /bin/bash
```
* You can also run directly a Python script as follows. 
```
docker-compose run --rm <name of the container that uses this image> python db-access/main.py
```
* Every time you use the command **_docker-compose run_**, a new unnamed container will be created. The **_--rm flag_** will automatically remove the created container once the run is over.
* Please consider that if you use **docker-compose run**, the bash script **run.sh** needs to be run manually in order to execute the application

### Architecture ###

![alt text](architecture.png)

#### Containers ####

##### *pg-xml* #####
Database where the xml and csv converted files are stored.

##### *pg-rel* #####
Database where the relational data is stored, namely the entities of the system.

##### *importer* #####
Daemon-type application, which runs in the background. The application must constantly look for new CSV files in the Docker csv volume and start converting to XML and then migrating to the pg-xml database.

##### *migrater* #####
Daemon-type application, which runs in the background and is started every 5 mins (configurable). The application will check if there are new files in the imported_documents table of the pg-xml and perform the migration of the XML data to the pg-rel database tables, using the api-entities API.

##### *update-gis* #####
Daemon-type application, which runs in the background and is started every 5 mins (configurable). The application will select up to 100 entities from the pg-rel database for which it is necessary to update or obtain GPS coordinates. As with TP1, the coordinates can be obtained using Nominatim's Search API, with the already existing HTTP Requests module in Python.

##### *api-entities* #####
Web REST API in Django that allows performing CRUD of all entities. 

##### *api-gis* #####
Web REST API in Django that allows obtaining geographical data by region.

##### *api-proc* #####
Web REST API in Django that allows for reporting. Obtains the data from the RPC Server. 

##### *api-graphql* #####
Web GraphQL API that allows for reporting. Obtains the data from the Entities API.

##### *frontend-ent* #####
Web frontend application that allows consulting the entities' data.

##### *frontend-gis* #####
Web frontend application based in Leaflet that allows consulting the entities in a map.

##### *frontend-proc* #####
Web frontend application that allows consulting the reports of the system.

##### *rpc-server* #####
RPC application that does reporting over the XML database. 

#### Volumes ####

##### *csv* #####
Place where we can drop CSVs to be imported by the system.

##### *shared* #####
Generic volume that can be used for any purpose, to help out developing the other containers.

___
#### _Informatics Engineering @ipvc/estg, 2023-2024_ ####
###### _Professors: Jorge Ribeiro and Luís Teófilo_ ######