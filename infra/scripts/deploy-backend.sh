#!/bin/bash
set -e # Exit the script immediately if any command fails

INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

if ! [ -x "$(command -v terraform)" ]; then
  echo "Error: Terraform is not installed." >&2
  exit 1
fi

terraform -chdir=${INFRA_DIR}/backend init
terraform -chdir=${INFRA_DIR}/backend apply -auto-approve
