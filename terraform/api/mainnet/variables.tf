variable "aws_region" {
  description = "AWS region"
  default     = "us-west-1"
}

variable "aws_profile" {
  description = "AWS profile"
  default     = "default"
}

variable "project_name" {
  description = "Project name"
  default     = "connextscan"
}

variable "package_name" {
  description = "Package name"
  default     = "connextscan-api"
}

variable "environment" {
  description = "Environment"
  default     = "mainnet"
}

variable "indexer_username" {
  description = "Indexer username"
  default     = ""
}

variable "indexer_password" {
  description = "Indexer password"
  default     = ""
}

variable "api_gateway_integration_id" {
  description = "API gateway integration id"
  default     = ""
}

variable "log_level" {
  description = "Log level"
  default     = "debug"
}

variable "whitelists" {
  description = "Wallet whitelists"
  default     = ""
}