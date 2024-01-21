package main

import (
	"database/sql"
	"encoding/xml"
	"fmt"
	"net/http"
	"log"
	"time"

	"github.com/antchfx/xmlquery"
	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
	"github.com/go-resty/resty/v2"
)

type Country struct {
	XMLName xml.Name `xml:"country"`
	Id      string   `xml:"id,attr"`
	Name    string   `xml:"iso_country,chardata"`
}

type Region struct {
	XMLName xml.Name `xml:"region"`
	Id      string   `xml:"id,attr"`
	Name    string   `xml:"iso_region,attr"`
}
type Airport struct {
    XMLName   xml.Name `xml:"airport"`
    Id        string   `xml:"id,attr"`
    Name      string   `xml:"name,attr"`
}

const (
	apiCountry = "http://api-entities:8080/country"
	apiRegion     = "http://api-entities:8080/region"
	apiAirport = "http://api-entities:8080/airport"
)

func main() {
	connectionString := "postgres://is:is@db-xml/is?sslmode=disable"

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Erro ao conectar ao base de dados:", err)
	}

	fmt.Println("Conexão com o base de dados estabelecida com sucesso!")

	conn, err := amqp.Dial("amqp://is:is@broker:5672/is")
	if err != nil {
		log.Fatalf("Erro ao conectar ao servidor RabbitMQ: %s", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir o canal: %s", err)
	}
	defer ch.Close()

	// Consume mensagens da fila que já foi declarada pelo watcher
	msgs, err := ch.Consume("menssagem", "", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("Erro ao consumir mensagens: %s", err)
	}

	for msg := range msgs {
		fileName := string(msg.Body)

		fmt.Printf("Nome do arquivo do XML recebido: %s\n", fileName)

		xmlQuery := "SELECT xml FROM public.imported_documents WHERE file_name = $1"

		var xmlData string
		err := db.QueryRow(xmlQuery, fileName).Scan(&xmlData)
		if err != nil {
			log.Fatalf("Erro ao buscar XML do base de dados: %s", err)
		}

		doc, err := xmlquery.Parse(strings.NewReader(xmlData))
		if err != nil {
			log.Fatalf("Erro ao analisar o XML: %s", err)
		}

		// Processar country e enviar
		processCountry(doc)
		// Processar region e enviar
		processRegion(doc)
		// Processar airport e enviar
		processAirport(doc)
	}
}

// Country

func processCountry(doc *xmlquery.Node) {
	nodes := xmlquery.Find(doc, "//Countries/Country")

	var countries []Country

	for _, node := range nodes {
		country := Country{
			iso_country: node.SelectAttr("iso_country"),
		}
		countries = append(countries, country)
	}

	// Apresentar todos os paises
	fmt.Println("Países encontrados:")
	for _, c := range countries {
		fmt.Printf(" Nome: %s\n", c.iso_country)
	}

	err := envCountry(countries)
	if err != nil {
		log.Fatalf("Erro ao enviar países para a API: %s", err)
	}
}

func envCountry(countries []Country) error {
	client := resty.New()

	for _, country := range countries {
		// Ajustar para o formato JSON
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(map[string]string{
				"iso_country": country.iso_country,
			}).
			Post(apiCountry)

		if err != nil {
			return fmt.Errorf("Erro ao enviar país para a API: %s", err)
		}

		if resp.StatusCode() != 201 {
			return fmt.Errorf("Erro ao enviar país para a API. %d", resp.StatusCode())
		}

		fmt.Printf("País enviado para a API. Nome: %s\n", country.iso_country)
	}

	return nil
}

// Region

func processRegion(doc *xmlquery.Node) {
	nodes := xmlquery.Find(doc, "//Regions/Region")

	var regions []Region

	for _, node := range nodes {
		region := Region{
			iso_region: node.SelectAttr("iso_region"),
		}
		regions = append(regions, region)
	}

	// Apresentar todos os paises
	fmt.Println("Países encontrados:")
	for _, c := range regions {
		fmt.Printf(" Nome: %s\n", c.iso_region)
	}

	err := envRegion(regions)
	if err != nil {
		log.Fatalf("Erro ao enviar regiões para a API: %s", err)
	}
}

func envRegion(regions []Region) error {
	client := resty.New()

	for _, region := range regions {
		// Ajustar para o formato JSON
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(map[string]string{
				"iso_region": region.iso_region,
			}).
			Post(apiRegion)

		if err != nil {
			return fmt.Errorf("Erro ao enviar região para a API: %s", err)
		}

		if resp.StatusCode() != 201 {
			return fmt.Errorf("Erro ao enviar região para a API. %d", resp.StatusCode())
		}

		fmt.Printf("Região enviado para a API. Nome: %s\n", region.iso_region)
	}

	return nil
}

// Airport

func processAirport(doc *xmlquery.Node) {
	nodes := xmlquery.Find(doc, "//Airports/Airport")

	var airports []Airport

	for _, node := range nodes {
		airport := Airport{
			name: node.SelectAttr("name"),
		}
		airports = append(airports, airport)
	}

	// Apresentar todos os paises
	fmt.Println("Países encontrados:")
	for _, c := range airports {
		fmt.Printf(" Nome: %s\n", c.name)
	}

	err := envAirport(airports)
	if err != nil {
		log.Fatalf("Erro ao enviar aeroportos para a API: %s", err)
	}
}

func envAirport(airports []Airport) error {
	client := resty.New()

	for _, airport := range airports {
		// Ajustar para o formato JSON
		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(map[string]string{
				"name": airport.name,
			}).
			Post(apiAirport)

		if err != nil {
			return fmt.Errorf("Erro ao enviar aeroporto para a API: %s", err)
		}

		if resp.StatusCode() != 201 {
			return fmt.Errorf("Erro ao enviar aeroporto para a API. %d", resp.StatusCode())
		}

		fmt.Printf("Aeroporto enviado para a API. Nome: %s\n", airport.name)
	}

	return nil
}