terragrunt = {
  # Configure Terragrunt to automatically store tfstate files in an S3 bucket
  remote_state {
    backend = "s3"
    config {
      encrypt = "true"
      bucket  = "straycat.dhs.org-straycat-terraform"
      key     = "svc-central-booking.tfstate"
      region  = "us-east-1"
    }
  }
}

account_id = "straycat"
aws_region = "us-east-1"
domain = "straycat.dhs.org"
subnet_type = "private"
instance_key_name = "straycat-tmclaugh-threatstack"
asg_min_size = 0
asg_max_size = 0
asg_desired_capacity = 0
