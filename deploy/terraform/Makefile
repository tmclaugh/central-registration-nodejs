# https://github.com/robert-stuttaford/terraform-example/blob/master/_production/Makefile

# FIXME: How do I conditionally import that file? Want to quiet a warning when
# running skel target.
#ifeq ($(shell test -f _env.mk && echo -n yes), yes)
include ${TF_ENV}.mk
#endif

all: plan

init: plan apply remote

skel:
	test -d environments || mkdir environments
	for _env in master dev prod; do test -d environments/$$_env || mkdir environments/$$_env; done
	
	test -d modules || mkdir modules
	for _env in master dev prod; do \
		test -L environments/$$_env/modules || ln -s ../../modules environments/$$_env; \
		test -L environments/$$_env/Makefile || ln -s ../../Makefile.global environments/$$_env/Makefile; \
	done
	
	for _file in variables.global.tf outputs.global.tf providers.global.tf data.global.tf main.global.tf; do \
		test -f $$_file || touch $$_file; \
		for _env in master prod dev; do \
			test -L environments/$$_env/$${_file/.global./.} || ln -s ../../$${_file} environments/$$_env/$${_file/.global./.}; \
		done; \
	done


s3_state:
	terraform plan -var-file=_env.tfvars -out init.plan
	terraform apply init.plan

remote:
	terraform remote config \
		-backend=s3 \
		-backend-config="profile=${profile}" \
		-backend-config="bucket=${tf-state-bucket}" \
		-backend-config="key=${service}/terraform.tfstate" \
		-backend-config="region=${region}" \
		-backend-config="encrypt=1"

show:
	terraform show | grep module | sort

fmt:
	terraform fmt

get:
	terraform get

refresh:
	terraform refresh -var-file=${env}.tfvars

plan: get
	terraform plan -var-file=${env}.tfvars -out proposed-${env}.plan

plan-destroy: get
	terraform plan -destroy -var-file=${env}.tfvars -out proposed-destroy-${env}.plan

apply:
	terraform apply proposed-${env}.plan

destroy:
	terraform destroy proposed-destroy-${env}.plan

output:
	terraform output -no-color -json > tf_outputs.json

