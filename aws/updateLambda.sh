#!/bin/bash

zip -r app.zip app/
aws lambda update-function-code \
    --function-name "ipfs" \
    --zip-file "fileb://./app.zip" 


