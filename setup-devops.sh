#!/bin/bash
set -e

echo "Starting DevOps Infrastructure Setup..."

# Update package lists
sudo apt-get update

# Install dependencies
sudo apt-get install -y curl wget apt-transport-https software-properties-common ca-certificates default-jre default-jdk

# Install Ansible
echo "Installing Ansible..."
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt-get install -y ansible

# Install Nginx
echo "Installing Nginx..."
sudo apt-get install -y nginx

# Install kubectl
echo "Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Install Minikube
echo "Installing Minikube..."
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

# Install Jenkins
echo "Installing Jenkins..."
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install -y jenkins

echo "Starting Jenkins service..."
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "========================================"
echo "Setup Complete!"
echo "Jenkins is running on http://localhost:8080"
echo "To get your Jenkins initial admin password, run:"
echo "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
echo "========================================"
