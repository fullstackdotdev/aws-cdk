#!/bin/bash

aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name LambdaWithNoTriggers \
    --invocation-type RequestResponse \
    --payload '{ "name": "Bob" }' \
    response.json
