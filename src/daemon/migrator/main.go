package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"log"
	"time"

	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

const (
	host_org   = "db-xml"
	host_dst   = "db-rel"
	queueBrandsModels  = "migrator_brands_models_queue"
	user       = "is"
	password   = "is"
	dbname     = "is"
	port       = 5432
)

type Message struct {
	CountryName string `json:"CountryName"`
	RegionName  string `json:"RegionName"`
	AiportName  string `json:"AirportName"`
}

type Country struct {
	CountryName string `json:"CountryName"`
}

type Region struct {
	RegionName string `json:"RegionName"`
	CountryID  string `json:"CountryID"`
}

type Airport struct {
	AirportName string `json:"AirportName"`
	RegionID    string `json:"RegionID"`
}




func main() {
	conn, err := amqp.Dial("amqp://is:is@broker:5672/is")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer ch.Close()

	_, err = ch.QueueDeclare(
		queueBrandsModels, 
		true,      
		false,     
		false,     
		false,    
		nil,       
	)
	if err != nil {
		log.Fatal(err)
	}

	msgs, err := ch.Consume(
		queueBrandsModels,
		"",        
		true,      
		false,     
		false,     
		false,    
		nil,       
	)
	if err != nil {
		log.Fatal(err)
	}

	var receivedMessages []Message
	var messagesProcessed bool

	for {
		select {
		case msg, ok := <-msgs:
			if !ok {
				fmt.Println("No messages in the queue. Exiting...")
				break
			}
		 
			var receivedMessage Message
			err := json.Unmarshal(msg.Body, &receivedMessage)
			if err != nil {
				log.Println("Error unmarshalling message body:", err)
				continue
			}
	
			originalJSON, err := json.Marshal(receivedMessage)
			if err != nil {
				log.Println("Error marshalling original message to JSON:", err)
				continue
			}
	
			fmt.Println("Received a message:", string(originalJSON))
			receivedMessages = append(receivedMessages, receivedMessage)
	
		case <-time.After(10 * time.Second):
			if len(receivedMessages) > 0 && !messagesProcessed {
				messagesProcessed = true
				fmt.Println("Messages processed. Exiting...")
	
				airportsByRegion := make(map[string][]Message)
				regionsByCountry := make(map[string][]Message)

				for _, msg := range receivedMessages {
					airportsByRegion[msg.CountryName+"_"+msg.RegionName] = append(airportsByRegion[msg.CountryName+"_"+msg.RegionName], msg)
					regionsByCountry[msg.CountryName] = append(regionsByCountry[msg.CountryName], msg)
				}
				
				// Create countries
				for countryName := range regionsByCountry {
					countryID, err := postCountryName(countryName)
					if err != nil {
						log.Println("Error posting country:", err)
						continue
					}

					// Create regions within countries
					for _, region := range regionsByCountry[countryName] {
						regionID, err := postRegionName(region.RegionName, countryID)
						if err != nil {
							log.Println("Error posting region:", err)
							continue
						}

						// Create airports within regions
						for _, airport := range airportsByRegion[countryName+"_"+region.RegionName] {
							err := postAirportName(airport.AiportName, regionID)
							if err != nil {
								log.Println("Error posting airport:", err)
								continue
							}
						}
					}
				}
			
			} else {
				fmt.Println("No messages received for 10 seconds. Exiting...")		
			}
		}
	}
}


func postCountryName(countryName string) (string, error) {
	url := fmt.Sprintf("%s/countries/addCountry", apiBaseURL)
	jsonData := fmt.Sprintf(`{"CountryName":"%s"}`, countryName)
	resp, err := http.Post(url, "application/json", strings.NewReader(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		CountryID string `json:"CountryID"`
	}

	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("failed to post country: %s", resp.Status)
	}

	return result.CountryID, nil
}

func postRegionName(regionName string, countryID string) (string, error) {
	url := fmt.Sprintf("%s/regions/addRegion", apiBaseURL)
	jsonData := fmt.Sprintf(`{"RegionName":"%s","CountryID":"%s"}`, regionName, countryID)
	resp, err := http.Post(url, "application/json", strings.NewReader(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		RegionID string `json:"RegionID"`
	}

	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("failed to post region: %s", resp.Status)
	}

	return result.RegionID, nil
}

func postAirportName(airportName string, regionID string) error {
	url := fmt.Sprintf("%s/airports/addAirport", apiBaseURL)
	jsonData := fmt.Sprintf(`{"AirportName":"%s","RegionID":"%s"}`, airportName, regionID)
	resp, err := http.Post(url, "application/json", strings.NewReader(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to post airport: %s", resp.Status)
	}

	return nil
}

func postRegionWithAirport(regionName, countryID string) (string, error) {
    url := fmt.Sprintf("%s/regions/addRegion", apiBaseURL)
    jsonData := fmt.Sprintf(`{"RegionName":"%s","CountryID":"%s"}`, regionName, countryID)
    resp, err := http.Post(url, "application/json", strings.NewReader(jsonData))
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var result struct {
        RegionID string `json:"RegionID"`
    }

    err = json.NewDecoder(resp.Body).Decode(&result)
    if err != nil {
        return "", err
    }

    if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
        return "", fmt.Errorf("failed to post region: %s", resp.Status)
    }

    return result.RegionID, nil
}

func postCountryWithRegion(countryName string, regionID string) error {
    url := fmt.Sprintf("%s/countries/addCountry", apiBaseURL)
    jsonData := fmt.Sprintf(`{"CountryName":"%s","RegionID":"%s"}`, countryName, regionID)
    resp, err := http.Post(url, "application/json", strings.NewReader(jsonData))
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
        return fmt.Errorf("failed to post country: %s", resp.Status)
    }

    return nil
}