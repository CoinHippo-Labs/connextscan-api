terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.14"
    }
  }
  required_version = ">= 1.0.0"
}

# Main AWS region where the resources should be created in
# Should be close to where your Next.js deployment is located
provider "aws" {
  region  = "us-west-1"
  profile = "default"
}

module "next_image_optimizer" {
  source             = "milliHQ/next-js-image-optimization/aws"
  deployment_name    = "connext-next-image"
  next_image_domains = ["metadata.ens.domains", "connextscan.io", "www.connextscan.io", "staging.connextscan.io", "testnet.connextscan.io", "bridge.connext.network", "staging.bridge.connext.network", "testnet.bridge.connext.network", "testnet-staging.bridge.connext.network", "amarok.connextscan.io", "staging.amarok.connextscan.io", "testnet.amarok.connextscan.io", "staging.testnet.amarok.connextscan.io", "amarok.bridge.connext.network", "amarok.coinhippo.io", "amarok-testnet.coinhippo.io", "amarok-testnet-staging.coinhippo.io", "d3f1g7sq6u4698.cloudfront.net", "d1h9h37hgxfzvk.cloudfront.net"]
}

output "domain" {
  value = module.next_image_optimizer.cloudfront_domain_name
}