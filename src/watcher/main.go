package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"log"

	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
	_ "github.com/streadway/amqp"
)

const jsonFilename = "filexml.json"

type File struct {
	name []string `json:"name"`
}

func main() {

	// Conectar á db
	connectionString := "postgres://is:is@db-xml/is?sslmode=disable"

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Erro ao conectar á db:", err)
	}

	fmt.Println("Conexão com o db estabelecida com sucesso!")

	// Consultar a db pelo nome dos ficheiros
	rows, err := db.Query("SELECT file_name FROM public.imported_documents")
	if err != nil {
		log.Fatal("Erro ao executar a consulta:", err)
	}
	defer rows.Close()

	// Variavel para armazenar os nomes
	var nameFiles []string

	// Correr todos os nomes para armazenar na variavel nameFiles
	for rows.Next() {
		var tempNameFile string
		err = rows.Scan(&tempNameFile)
		if err != nil {
			log.Fatal("Erro ao ler o resultado da consulta:", err)
		}
		nameFiles = append(nameFiles, tempNameFile)
		fmt.Printf("Nome do Arquivo: %s\n", tempNameFile)
	}

	atualizarJSON(nameFiles)
	
	time.Sleep(5 * time.Minute)
}

func enviarMensagemBroker(newNames []string) {

	// Estabelece conexão com o servidor RabbitMQ
	conn, err := amqp.Dial("amqp://is:is@broker:5672/is")
	if err != nil {
		log.Fatalf("Erro ao conectar ao servidor RabbitMQ: %s", err)
	}
	defer conn.Close()

	// Cria um canal
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir o canal: %s", err)
	}
	defer ch.Close()

	// Declara uma fila no RabbitMQ
	queue, err := ch.QueueDeclare("menssagem", false, false, false, false, nil)

	if err != nil {
		log.Fatalf("Erro ao declarar a fila: %s", err)
	}

	// Envia cada novo nome como uma mensagem para a fila
	for _, nome := range newNames {
		err = ch.Publish("", queue.Name, false, false, 
			amqp.Publishing{
				ContentType: "text/plain",
				Body:        []byte(nome),
			},
		)
		if err != nil {
			log.Fatalf("Erro ao enviar mensagem para a fila: %s", err)
		}
		fmt.Printf("Mensagem enviada para a fila: %s\n", nome)
	}
}

func atualizarJSON(newNames []string) {
	var files File

	// Verificar se o arquivo JSON existe
	if _, err := os.Stat(jsonFilename); err == nil {
		ficheiro, err := os.Open(jsonFilename)
		if err != nil {
			log.Fatal("Erro ao abrir o arquivo JSON:", err)
		}
		defer ficheiro.Close()

		decoder := json.NewDecoder(ficheiro)
		err = decoder.Decode(&files)
		if err != nil {
			log.Fatal("Erro ao decodificar o arquivo JSON:", err)
		}
	}

	// Mapear o nome dos ficheiros já salvos
	nameExist := make(map[string]bool)
	for _, name := range files.name {
		nameExist[name] = true
	}

	// Verificar se há novos ficheiros para adicionar
	var newFiles []string
	for _, name := range newNames {
		if !nameExist[nome] {
			newFiles = append(newFiles, name)
			nameExist[name] = true
		}
	}

	// Se houver novos files, atualize o arquivo JSON
	if len(newFiles) > 0 {
		for _, name := range newFiles {
			files.name = append(files.name, name)
		}

		// Criar ou Repor o arquivo JSON
		tempfile, err := os.Create(jsonFilename)
		if err != nil {
			log.Fatal("Erro ao criar o arquivo JSON:", err)
		}
		defer tempfile.Close()

		encoder := json.NewEncoder(tempfile)
		encoder.SetIndent("", "  ")
		err = encoder.Encode(files)
		if err != nil {
			log.Fatal("Erro ao codificar o arquivo JSON:", err)
		}

		fmt.Println("Arquivo JSON atualizado com sucesso!")
		enviarMensagemBroker(newFiles)
	} else {
		fmt.Println("Não houve novos files para adicionar.")
	}
}
