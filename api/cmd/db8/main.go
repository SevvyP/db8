package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	apiKey, ok := os.LookupEnv("GEMINI_API_KEY")
	if !ok {
		log.Fatalln("Environment variable GEMINI_API_KEY not set")
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.0-flash")

	model.SetTemperature(1)
	model.SetTopK(40)
	model.SetTopP(0.95)
	model.SetMaxOutputTokens(8192)
	model.ResponseMIMEType = "application/json"
	model.SystemInstruction = genai.NewUserContent(genai.Text("You are a debate fact checker operating on an agreed upon set of sources and facts. These sources and facts have been submitted and vetted by both sides of the debate, and you are to treat them as the absolute truth.\n\nAs a debate fact checker, your job is to process realtime arguments from debators and cross check these arguments against the provided sources and facts. You will grade each argument as either 'true', 'mixed', or 'false' if the argument is entirely based in fact, partially based on falsehood, or fully based in falsehood respectively. "))
	model.ResponseSchema = &genai.Schema{
		Type:     genai.TypeObject,
		Required: []string{"result"},
		Properties: map[string]*genai.Schema{
			"result": {
				Type:     genai.TypeObject,
				Required: []string{"grading"},
				Properties: map[string]*genai.Schema{
					"grading": {
						Type:        genai.TypeString,
						Description: "The grade of the argument based on factuality.",
						Enum:        []string{"true", "mixed", "false"},
					},
					"falsehoods": {
						Type:        genai.TypeArray,
						Description: "A list of falsehoods identified in the argument.",
						Items: &genai.Schema{
							Type:     genai.TypeObject,
							Required: []string{"summary", "correction"},
							Properties: map[string]*genai.Schema{
								"summary": {
									Type:        genai.TypeString,
									Description: "A brief description of the falsehood or error in the argument.",
								},
								"correction": {
									Type:     genai.TypeObject,
									Required: []string{"type", "details"},
									Properties: map[string]*genai.Schema{
										"type": {
											Type:        genai.TypeString,
											Description: "Indicates whether the correction is based on a fact or a source.",
											Enum:        []string{"fact", "source"},
										},
										"details": {
											Type:        genai.TypeString,
											Description: "The actual fact or correction that disproves the falsehood.",
										},
										"source": {
											Type:     genai.TypeObject,
											Required: []string{"reference"},
											Properties: map[string]*genai.Schema{
												"reference": {
													Type:        genai.TypeString,
													Description: "The reference material or source that disproves the claim.",
												},
												"line_number": {
													Type:        genai.TypeInteger,
													Description: "The line number of the reference (if applicable).",
												},
											},
										},
									},
								},
							},
						},
					},
					"explanation": {
						Type:        genai.TypeString,
						Description: "An optional field to provide further explanation or reasoning behind the grading decision.",
					},
				},
			},
		},
	}

	resp, err := model.GenerateContent(ctx, genai.Text("The Earth is flat."))
	if err != nil {
		log.Fatalf("Error sending message: %v", err.Error())
	}

	for _, part := range resp.Candidates[0].Content.Parts {
		fmt.Printf("%v\n", part)
	}
}
