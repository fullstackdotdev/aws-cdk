#!/bin/bash

# aws apigateway test-invoke-method \
#     --rest-api-id l7snv27a5c \
#     --resource-id x11z23 \
#     --http-method POST \
#     --path-with-query-string '/todos' \
#     --output json

curl -X POST \
    -d @request.json \
    https://5beaiuhqm2.execute-api.us-east-1.amazonaws.com/prod/todos \
    -o response.json # -H "Accept: application/json" -H "Content-Type: application/json" \
