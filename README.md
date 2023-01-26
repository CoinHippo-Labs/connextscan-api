# Connextscan API

## Endpoints
- mainnet: [https://api.connextscan.io](https://api.connextscan.io)
- testnet: [https://testnet.api.connextscan.io](https://testnet.api.connextscan.io)

## Stacks
- AWS Opensearch
- AWS Lambda
- AWS API Gateway

## Deployment
### Prerequisites
1. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html)
2. [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
3. [Install terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

### Install dependencies
```bash
yarn
```

### Deploy services
```bash
cd ./terraform/api/testnet
cp variables.tf.example variables.tf
terraform init
terraform apply
```
