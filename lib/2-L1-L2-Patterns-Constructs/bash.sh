#!/bin/bash

# test an API gateway using  aws-cli

# aws apigateway test-invoke-method \
#     --rest-api-id l7snv27a5c \
#     --resource-id x11z23 \
#     --http-method POST \
#     --path-with-query-string '/todos' \
#     --output json

# test an API gateway using  curl
curl -X POST \
    -d @request.json \
    https://1ynkl78wv9.execute-api.us-east-1.amazonaws.com/prod/todos \
    -o response.json # -H "Accept: application/json" -H "Content-Type: application/json" \
