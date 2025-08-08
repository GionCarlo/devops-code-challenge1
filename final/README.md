# DevOps Code Challenge — Final Hand-Off

## Public URLs
- **Frontend ALB:** http://devops-challenge-alb-1363161187.us-east-1.elb.amazonaws.com
- **Backend ALB (API):** http://devops-challenge-backend-alb-359679492.us-east-1.elb.amazonaws.com/api

## AWS (us-east-1)
- **Cluster:** devops-challenge-cluster
- **Services:** 
  - devops-challenge-frontend-service
  - devops-challenge-backend-service
- **Launch type:** Fargate
- **Load Balancer:** ALB → target groups per service

## Deploy (Terraform)
```bash
terraform -chdir=terraform/ecs init -upgrade
terraform -chdir=terraform/ecs apply -auto-approve


## CI/CD (Jenkins)
- Pipeline builds Docker images, pushes to ECR, and forces new ECS deployments.
- Trigger: push to `main`.

## Load Test & Scaling (Proof)
- Tool: `siege`
- Command run: `siege -c 250 -t 2M http://devops-challenge-alb-1363161187.us-east-1.elb.amazonaws.com/`
- Observations:
  - CPU spiked on the **frontend service** (see screenshot).
  - Service tasks scaled out and stabilized; then scaled back toward baseline after load.
- Evidence (in `final/artifacts/`):
  - `ecs-frontend-cpu.png` (CPUUtilization spike)
  - `ecs-events.png` (service started/stopped tasks)
  - `tg-health.png` (targets healthy)
  - *(optional)* CLI logs: `frontend-snapshot-*.txt`, `frontend-scaling-activities-*.txt`

## Verify
```bash
curl -I http://devops-challenge-alb-1363161187.us-east-1.elb.amazonaws.com/
curl -i  http://devops-challenge-backend-alb-359679492.us-east-1.elb.amazonaws.com/api
```

## Notes
- Backend may not scale directly via ALB traffic; frontend is the main entry point.
- Health checks are on the service target groups behind the ALB.
