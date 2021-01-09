#!/bin/bash

aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name NoSourceLambda-SourceIsUnknown9B240FA2-D1GA79BRDMOG \
    --invocation-type RequestResponse \
    --payload '{ "name": "Bob" }' \
    response.json
