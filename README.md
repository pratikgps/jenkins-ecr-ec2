# Project 04 – Jenkins CI/CD Pipeline → AWS ECR → EC2 Deployment (Node.js)

## 📌 Project Summary
This project implements a fully automated CI/CD pipeline using Jenkins, Docker, AWS Elastic Container Registry (ECR), and AWS EC2.

Whenever new code is pushed to GitHub, Jenkins automatically:

1. Pulls the code
2. Builds a Docker image
3. Authenticates to AWS ECR
4. Pushes image to ECR
5. Connects to EC2 via SSH
6. Pulls the latest image from ECR
7. Stops old container
8. Runs the new version on port 80

This results in automated deployment on every change.

---

## 🧰 Tools Used
- Jenkins (Dockerized Jenkins)
- GitHub
- Docker
- AWS ECR
- AWS EC2 (Ubuntu)
- AWS CLI
- Node.js
- Linux Shell
- SSH

---

## 📁 Repository Structure

project/
│
├── server.js
├── package.json
├── Dockerfile
├── Jenkinsfile
├── .dockerignore
└── .gitignore

yaml
Copy code

---

## 🔧 How Deployment Works (Simple Explanation)

- You push code to GitHub
- Jenkins detects it
- Jenkins builds the Docker image
- Jenkins uploads image to AWS ECR
- Jenkins connects to EC2
- EC2 pulls the new image
- Container restarts with updated version

---

## 🚀 Deployment Command Used on EC2
(automated inside Jenkins pipeline)

docker run -d --name project04-app -p 80:5000 IMAGE_NAME

yaml
Copy code

---

## 🔐 Jenkins Credentials Required

| Jenkins Credential ID | Type |
|----------------------|------|
| aws-ecr-creds        | Access key + Secret key |
| ec2-ssh-key          | SSH private key |

---

# ⚠ Troubleshooting (Simple Fixes)

**❌ Issue: AWS CLI not found on EC2**
Fix:
```bash
sudo apt update
sudo apt install unzip curl -y
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
❌ Issue: EC2 cannot pull image
Fix:
Run on EC2:

bash
Copy code
aws configure
Set correct access/secret keys
Set region correctly
(example: us-east-1 or ap-south-1)

Then:

bash
Copy code
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <your-registry>
❌ Issue: Site not loading
Fix:

open port 80 in EC2 Security Group

run:

bash
Copy code
docker ps
if container not running:

bash
Copy code
docker logs project04-app
❌ Issue: Permission denied on Docker
Fix on host:

bash
Copy code
sudo chmod 666 /var/run/docker.sock
🏆 What I Learned
Jenkins pipeline writing

Docker image automation

ECR authentication workflow

EC2 container deployment

SSH automation in CI/CD

Handling build failures

Debugging deployment issues

