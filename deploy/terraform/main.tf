/*
* Deploy Central-registration-nodejs
*/

/*
* variables
*/
variable "account_id" {}
variable "instance_key_name" {}
variable "aws_region" {}
variable "subnet_type" {}
variable "asg_min_size" {}
variable "asg_max_size" {}
variable "asg_desired_capacity" {}


/*
* resources
*/
module "central_registration_nodejs" {
  source                = "github.com/tmclaugh/tf_straycat_svc"
  svc_name              = "central-registration"
  account_id            = "${var.account_id}"
  aws_region            = "${var.aws_region}"
  subnet_type           = "${var.subnet_type}"
  asg_min_size          = "${var.asg_min_size}"
  asg_max_size          = "${var.asg_max_size}"
  asg_desired_capacity  = "${var.asg_desired_capacity}"
  instance_key_name     = "${var.instance_key_name}"
}


/*
* outputs
*/
output "launch_config_id" {
  value = "${module.central_registration_nodejs.launch_config_id}"
}

output "autoscaling_group_id" {
  value = "${module.central_registration_nodejs.autoscaling_group_id}"
}

output "autoscaling_group_name" {
  value = "${module.central_registration_nodejs.autoscaling_group_name}"
}

output "autoscaling_group_availability_zones" {
  value = "${module.central_registration_nodejs.autoscaling_group_availability_zones}"
}

output "autoscaling_group_min_size" {
  value = "${module.central_registration_nodejs.autoscaling_group_min_size}"
}

output "autoscaling_group_max_size" {
  value = "${module.central_registration_nodejs.autoscaling_group_max_size}"
}

output "autoscaling_group_desired_capacity" {
  value = "${module.central_registration_nodejs.autoscaling_group_desired_capacity}"
}

output "autoscaling_group_launch_configuration" {
  value = "${module.central_registration_nodejs.autoscaling_group_launch_configuration}"
}

output "autoscaling_group_vpc_zone_identifier" {
  value = "${module.central_registration_nodejs.autoscaling_group_vpc_zone_identifier}"
}

output "iam_role_arn" {
  value = "${module.central_registration_nodejs.iam_role_arn}"
}

output "iam_role_name" {
  value = "${module.central_registration_nodejs.iam_role_name}"
}

output "iam_instance_profile_arn" {
  value = "${module.central_registration_nodejs.iam_instance_profile_arn}"
}

output "iam_instance_profile_name" {
  value = "${module.central_registration_nodejs.iam_instance_profile_name}"
}

output "iam_instance_profile_roles" {
  value = "${module.central_registration_nodejs.iam_instance_profile_roles}"
}

output "security_group_id" {
  value = "${module.central_registration_nodejs.security_group_id}"
}

output "security_group_vpc_id" {
  value = "${module.central_registration_nodejs.security_group_vpc_id}"
}

output "security_group_ingress" {
  value = "${module.central_registration_nodejs.security_group_ingress}"
}

output "security_group_egress" {
  value = "${module.central_registration_nodejs.security_group_egress}"
}

output "security_group_name" {
  value = "${module.central_registration_nodejs.security_group_name}"
}

