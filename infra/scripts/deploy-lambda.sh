#!/bin/bash
set -e # Exit the script immediately if any command fails

STAGE=${1:-NULL}
INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"

if ! [ -x "$(command -v terraform)" ]; then
  echo "Error: Terraform is not installed." >&2
  exit 1
fi

if [ $STAGE != "dev" ] && [ $STAGE != "prod" ]; then
  echo "Error: STAGE must be 'dev' or 'prod'. Received: $STAGE" >&2
  exit 1
fi

# Go to the root of the project
cd ${APP_DIR}

# Install project dependencies
npm i

# Lambda function package - dist.zip
npm run build
cd dist && zip -r ../dist.zip ./* && cd ..

# Node.js layer package (node_modules) - nodejs-layer.zip
npm i --prefix ${INFRA_DIR}/lambda/layers/nodejs
cd ${INFRA_DIR}/lambda/layers && zip -r ${APP_DIR}/nodejs-layer.zip nodejs && cd ..

# Remove Terraform local state files
rm -rf ${INFRA_DIR}/lambda/.terraform

# Terraform deploy
terraform -chdir=${INFRA_DIR}/lambda init -backend-config="env/${STAGE}.s3.tfbackend"
terraform -chdir=${INFRA_DIR}/lambda apply -var-file=env/${STAGE}.tfvars -auto-approve
