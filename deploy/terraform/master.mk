# Environment information for Makefile

# environment name
env=master

# AWS creds profile name
profile=straycat

# We prefix our buckets with our domain name to help avoid S3 name collisions.
domain=straycat.dhs.org

# Our AWS region
region=us-east-1

# Name of service
service=central-registration-nodejs

# Terraform state bucket name
tf-state-bucket=${domain}-${env}-terraform

