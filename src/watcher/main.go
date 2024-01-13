package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"log"

	"github.com/beevik/etree"
	"github.com/streadway/amqp"
	_ "github.com/lib/pq"
)

const (
	host     = "db-xml"
	port     = 5432
	user     = "is"
	password = "is"
	dbname   = "is"
	jsonFile = "FilesXML.json"
    queueBrandsModels = "migrator_countries_queue"
	queueCounties = "migrator_regions_queue"
	queueCars = "migrator_airports_queue"
	queueCountiesGIS = "update-gis_counties_queue"
	

)

type Country struct{
	CountryName string `json:"country_name"`
}

type Region struct {
	RegionName string `json:"region_name"`
	Country    Country `json:"country"`
}

type Airport struct {
	AirportName  string `json:"airport_name"`
	BaseMSRP     string `json:"base_msrp"`
	Range        string `json:"range"`
	Region       Region `json:"region"`
}

func main() {

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	// Verifique se o arquivo JSON existe
	fileInfo := make([]map[string]interface{}, 0)
	if _, err := os.Stat(jsonFile); err == nil {
		// Se o arquivo existir, carregue as informações existentes
		fileInfo, err = loadFileInformation()
		if err != nil {
			panic(err)
		}
	}

	fmt.Println("Successfully connected!")

	// Adicione a chamada da função para recuperar os novos nomes dos arquivos e datas de criação
	newFileInfo, err := getNewFileInformation(db, fileInfo)
	if err != nil {
		panic(err)
	}

	// Adicione apenas as novas informações ao slice
	fileInfo = append(fileInfo, newFileInfo...)

	// Crie um arquivo JSON e escreva as informações se houver novos arquivos
	if len(newFileInfo) > 0 {
		jsonFile, err := os.Create(jsonFile)
		if err != nil {
			panic(err)
		}
		defer jsonFile.Close()

		encoder := json.NewEncoder(jsonFile)
		encoder.SetIndent("", "  ")

		err = encoder.Encode(fileInfo)
		if err != nil {
			panic(err)
		}

		fmt.Println("New xml files in the database written to", jsonFile.Name())

		var fileNames []string
        for _, info := range newFileInfo {
            fileNames = append(fileNames, info["file_name"].(string))
        }
		countries := processModelsXML(fileNames)
		regions := processCountiesXML(fileNames)
		airports := processCarsXML(fileNames)
		sendMessagesToRabbitMQ(countries, regions, airports)

    } else {
        fmt.Println("No new files in the database.")
    }
}


// Função para recuperar os novos nomes dos arquivos e datas de criação da tabela imported_documents
func getNewFileInformation(db *sql.DB, existingInfo []map[string]interface{}) ([]map[string]interface{}, error) {
	rows, err := db.Query("SELECT file_name FROM imported_documents")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	newFileInfo := make([]map[string]interface{}, 0)

	for rows.Next() {
		var fileName string
		err := rows.Scan(&fileName)
		if err != nil {
			return nil, err
		}

		// Verifique se o fileName já existe nas informações existentes
		if !containsFileName(existingInfo, fileName) {
			newFileInfo = append(newFileInfo, map[string]interface{}{
				"file_name":  fileName,
			})
		}
	}

	return newFileInfo, nil
}

// Função para verificar se o fileName já existe nas informações existentes
func containsFileName(existingInfo []map[string]interface{}, fileName string) bool {
	for _, info := range existingInfo {
		if info["file_name"] == fileName {
			return true
		}
	}
	return false
}

// Função para carregar as informações existentes do arquivo JSON
func loadFileInformation() ([]map[string]interface{}, error) {
	jsonFile, err := os.Open(jsonFile)
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()

	var fileInfo []map[string]interface{}

	decoder := json.NewDecoder(jsonFile)
	err = decoder.Decode(&fileInfo)
	if err != nil {
		return nil, err
	}

	return fileInfo, nil
}


func processCountriesXML(fileNames []string) []Country {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected to db-xml!")

	var countries []Country

	uniqueCountries := make(map[Country]struct{})

	for _, fileName := range fileNames {
		// Consultar o XML na tabela imported_documents usando XPath
		rows, err := db.Query("SELECT xml FROM imported_documents WHERE file_name = $1", fileName)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		for rows.Next() {
			var xmlString string
			err := rows.Scan(&xmlString)
			if err != nil {
				log.Fatal(err)
			}

			// Parse do XML
			doc := etree.NewDocument()
			if err := doc.ReadFromString(xmlString); err != nil {
				log.Fatal(err)
			}

			// Exemplo de consulta XPath para extrair todas as Brands e Models
			brands := doc.FindElements("//Brand")
			for _, brand := range brands {
				brandName := brand.SelectAttrValue("name", "")

				models := brand.FindElements("./Models/Model")
				for _, model := range models {
					modelName := model.SelectAttrValue("model", "")

					brandModel := BrandModel{
						BrandName: brandName,
						ModelName: modelName,
					}

					if _, exists := uniqueModels[brandModel]; !exists {
						// Adicione o modelo único à lista e ao mapa
						countries = append(countries, extractCountryInfo(doc)...)
						uniqueModels[brandModel] = struct{}{}
					}
				}
			}
		}
	}

	fmt.Println("Countries:", countries)
	return countries
}

func extractCountryInfo(doc *etree.Document) []Country {
	var countries []Country

	// Exemplo de consulta XPath para extrair informações sobre Country
	countryElements := doc.FindElements("//Country")
	for _, countryElement := range countryElements {
		countryName := countryElement.SelectAttrValue("name", "")

		country := Country{
			CountryName: countryName,
		}

		countries = append(countries, country)
	}

	return countries
}

func processRegionsXML(fileNames []string) []Region {
    // Conectar à db-xml
    psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
        "password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)
    db, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    err = db.Ping()
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Successfully connected to db-xml!")

    var regions []Region

    for _, fileName := range fileNames {
        // Consultar o XML na tabela imported_documents usando XPath
        rows, err := db.Query("SELECT xml FROM imported_documents WHERE file_name = $1", fileName)
        if err != nil {
            log.Fatal(err)
        }
        defer rows.Close()

        for rows.Next() {
            var xmlString string
            err := rows.Scan(&xmlString)
            if err != nil {
                log.Fatal(err)
            }

            // Parse do XML
            doc := etree.NewDocument()
            if err := doc.ReadFromString(xmlString); err != nil {
                log.Fatal(err)
            }

            // Exemplo de consulta XPath para extrair informações sobre Car
            regions = append(regions, extractRegionInfo(doc)...)
        }
    }

    fmt.Println("Regions:", regions)
    return regions
}

func extractRegionInfo(doc *etree.Document) []Region {
    var regions []Region

    // Exemplo de consulta XPath para extrair informações sobre Car
    RegionElements := doc.FindElements("//Region")
    for _, RegionElement := range regionElements {
		regionName := regionElement.SelectAttrValue("name", "")
		countryName := regionElement.FindElement("./Country").SelectAttrValue("name", "")

		country := Country{
			CountryName: countryName,
		}

		region := Region{
			RegionName: regionName,
			Country:    country,
		}

		regions = append(regions, region)
	}

	return regions
}

func getModelName(doc *etree.Document, modelRef string) string {
    // Exemplo de consulta XPath para obter o nome do Model
    modelElement := doc.FindElement(fmt.Sprintf("//Model[@id='%s']", modelRef))
    if modelElement != nil {
        return modelElement.SelectAttrValue("model", "")
    }
    return ""
}

func getCountyName(doc *etree.Document, countyRef string) string {
    // Exemplo de consulta XPath para obter o nome do County
    countyElement := doc.FindElement(fmt.Sprintf("//County[@id='%s']", countyRef))
    if countyElement != nil {
        return countyElement.SelectAttrValue("name", "")
    }
    return ""
}


func processAirportsXML(fileNames []string) []string {
	// Conectar à db-xml
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to db-xml!")

	var airports []Airport

	uniqueCounties := make(map[string]struct{})
	
	for _, fileName := range fileNames{
			// Consultar o XML na tabela imported_documents usando XPath
			rows, err := db.Query("SELECT xml FROM imported_documents WHERE file_name = $1", fileName)
			if err != nil {
				log.Fatal(err)
			}
			defer rows.Close()
	
			for rows.Next() {
				var xmlString string
				err := rows.Scan(&xmlString)
				if err != nil {
					log.Fatal(err)
				}
	
				// Parse do XML
				doc := etree.NewDocument()
				if err := doc.ReadFromString(xmlString); err != nil {
					log.Fatal(err)
				}
	
				// Exemplo de consulta XPath para extrair todas as Brands
				counties := doc.FindElements("//County")
				for _, county := range counties {
					countyName := county.SelectAttrValue("name", "")
					//fmt.Printf("Brand Name: %s\n", brandName)

					if _, exists := uniqueCounties[countyName]; !exists {
						airports = append(airports, extractAirportInfo(doc)...)
						uniqueCounties[countyName] = struct{}{}
					}
				}
			}
		}
	
		fmt.Println("Airports:", airports)
		return airports
}

func extractAirportInfo(doc *etree.Document) []Airport {
	var airports []Airport

	// Exemplo de consulta XPath para extrair informações sobre Airport
	airportElements := doc.FindElements("//Airport")
	for _, airportElement := range airportElements {
		airportName := airportElement.SelectAttrValue("name", "")
		baseMSRP := airportElement.FindElement("./Information").SelectAttrValue("basemsrp", "")
		range := airportElement.FindElement("./Information").SelectAttrValue("range", "")
		regionName := airportElement.FindElement("./Region").SelectAttrValue("name", "")

		region := Region{
			RegionName: regionName,
		}

		airport := Airport{
			AirportName:  airportName,
			BaseMSRP:     baseMSRP,
			Range:        range,
			Region:       region,
		}

		airports = append(airports, airport)
	}

	return airports
}


//func sendMessagesToRabbitMQ(brandModels []BrandModel, countyNames []string) error {
func sendMessagesToRabbitMQ(brandModels []BrandModel, countyNames []string, cars []Car) error {
	conn, err := amqp.Dial("amqp://is:is@broker:5672/is")
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()


	// Declare a primeira fila no RabbitMQ
	_, err = ch.QueueDeclare(
		queueBrandsModels, // nome da fila
		true,      // durável
		false,     // exclusiva
		false,     // autodelete
		false,     // sem dead letter exchange
		nil,       // argumentos
	)
	if err != nil {
		return err
	}

	_, err = ch.QueueDeclare(
		queueCounties, // nome da fila 
		true,            // durável
		false,           // exclusiva
		false,           // autodelete
		false,           // sem dead letter exchange
		nil,             // argumentos
	)
	if err != nil {
		return err
	}

	_, err = ch.QueueDeclare(
		queueCountiesGIS, // nome da fila
		true,             // durável
		false,            // exclusiva
		false,            // autodelete
		false,            // sem dead letter exchange
		nil,
	)
	if err != nil {
		return err
	}

	// Faz o binding da fila QueueCounties à exchange

	_, err = ch.QueueDeclare(
		queueCars,   // name of the queue
		true,        // durable
		false,       // exclusive
		false,       // autodelete
		false,       // no dead letter exchange
		nil,         // arguments
	)
	if err != nil {
		return err
	}
	


		// Adicione a lógica para enviar os brandModels
		for _, brandModel := range brandModels {
			messageBody, err := json.Marshal(brandModel)
			if err != nil {
				fmt.Println("Error marshalling brand model:", err)
				continue
			}
	
			err = ch.Publish(
				"",                // exchange
				queueBrandsModels,   // chave da fila de atraso
				false,             // mandatório
				false,             // imediato
				amqp.Publishing{
					ContentType: "application/json",
					Body:        messageBody,
				})
			if err != nil {
				fmt.Println("Error publishing brand model to RabbitMQ:", err)
			}
		}

		
		for _, countyName := range countyNames {
			fmt.Println("County Name:", countyName)
			messageBody, err := json.Marshal(map[string]interface{}{
				"County": countyName,
			})
			
			if err != nil {
				fmt.Println("Error marshalling message body:", err)
				continue
			}
	
			err = ch.Publish(
				"",        // exchange
				queueCounties, // chave da fila
				false,     // mandatório
				false,     // imediato
				amqp.Publishing{
					ContentType: "application/json",
					Body:        messageBody,
				})
			if err != nil {
				fmt.Println("Error publishing message to RabbitMQ:", err)
			}
		}

		

		for _, countyName := range countyNames {
			fmt.Println("County Name (for queueCountiesGIS):", countyName)
			messageBody, err := json.Marshal(map[string]interface{}{
				"County": countyName,
			})
		
			if err != nil {
				fmt.Println("Error marshalling message body:", err)
				continue
			}
	
		
			err = ch.Publish(
				"",        // exchange
				queueCountiesGIS, // chave da fila
				false,     // mandatório
				false,     // imediato
				amqp.Publishing{
					ContentType: "application/json",
					Body:        messageBody,
				})
			if err != nil {
				fmt.Println("Error publishing message to queueCountiesGIS:", err)
			}
		}



		for _, car := range cars {
			fmt.Printf("Sending car message to queueCars: %+v\n", car)
			messageBody, err := json.Marshal(car)
			if err != nil {
				fmt.Println("Error marshalling car:", err)
				continue
			}
	
			err = ch.Publish(
				"",          // exchange
				queueCars,   // chave da fila
				false,       // mandatório
				false,       // imediato
				amqp.Publishing{
					ContentType: "application/json",
					Body:        messageBody,
				})
			if err != nil {
				fmt.Println("Error publishing car to RabbitMQ:", err)
			}
		}	
		

	fmt.Println("Messages sent to RabbitMQ successfully.")
	return nil
}
