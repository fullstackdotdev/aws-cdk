#!/bin/bash

# aws apigateway test-invoke-method \
#     --rest-api-id c27p8736x4 \
#     --resource-id qn1cvw \
#     --http-method GET \
#     --path-with-query-string '/todos' \
#     --output response.json

curl -X GET https://c27p8736x4.execute-api.us-east-1.amazonaws.com/prod/todos -o response.json
