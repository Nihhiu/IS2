package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func sayHelloWorld() {
	fmt.Println("Hello, World!!")
}

func listXMLFiles() {
	files, err := ioutil.ReadDir("/xml")
	if err != nil {
		fmt.Printf("Error accessing /xml: %s\n", err)
		return
	}

	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".xml") {
			fmt.Printf("\t> %s\n", f.Name())
		}
	}
}

func main() {
	sayHelloWorld()
	listXMLFiles()
}
