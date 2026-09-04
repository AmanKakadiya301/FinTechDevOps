<div align="center">

# 🚀 FinTechDevOps: Institutional Trading Terminal

Enterprise-grade cloud-native trading platform built using **Microservices, Kubernetes, DevSecOps, Infrastructure as Code, Event-Driven Architecture, and Observability**. The project simulates institutional trading workflows with real-time trade execution, portfolio management, AI-powered market prediction, secure deployments, and production-style infrastructure automation.

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![ELK](https://img.shields.io/badge/ELK_Stack-005571?style=for-the-badge)
![Vault](https://img.shields.io/badge/HashiCorp_Vault-000000?style=for-the-badge&logo=vault)

</div>

---

## 📖 Overview

FinTechDevOps is a personal academic project developed to demonstrate modern software engineering, cloud-native infrastructure, and DevSecOps practices through a realistic institutional trading platform.

The system is built around a distributed microservices architecture consisting of multiple Spring Boot services deployed on Kubernetes and automated through a complete CI/CD pipeline. It supports trade execution, portfolio management, audit logging, risk validation, secure secret management, centralized observability, and AI-assisted market prediction.

The primary objective of the project is to gain hands-on experience with enterprise backend development, Kubernetes orchestration, Infrastructure as Code, security automation, observability, and production-grade deployment workflows.

---

## ✨ Key Features

- ⚡ Cloud-native microservices architecture
- 💼 Portfolio management workflows
- 📈 Real-time trade execution services
- 🤖 AI-powered price prediction engine
- 🔄 Event-driven communication using Apache Kafka
- 🚀 Automated DevSecOps CI/CD pipeline
- ☸️ Kubernetes-based container orchestration
- 📦 Infrastructure as Code using Ansible
- 🔒 Secure secret management with Vault technologies
- 📊 Centralized logging and observability using ELK Stack
- 📈 Horizontal Pod Autoscaling (HPA)
- 🔍 Automated vulnerability scanning with Docker Scout

---

## 🏗️ System Architecture

```text
                           React Dashboard
                                  │
                                  ▼
                            API Gateway
                                  │
        ┌──────────────┬──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
   Auth Service   User Service  Portfolio Service Trade Service
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                                  │
                             Apache Kafka
                                  │
         ┌─────────────┬─────────────┬─────────────┐
         │             │             │             │
         ▼             ▼             ▼             ▼
   Audit Service  Notification  Risk Service  AI Service
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|-----------|-------------|
| Backend | Java, Spring Boot, Spring Cloud |
| Frontend | React |
| Database | PostgreSQL |
| Cache | Redis |
| Messaging | Apache Kafka |
| Containerization | Docker, Docker Compose |
| CI/CD | Jenkins, GitHub Webhooks |
| Orchestration | Kubernetes |
| Infrastructure as Code | Ansible |
| Security | HashiCorp Vault, Ansible Vault, Kubernetes Secrets |
| Observability | Elasticsearch, Logstash, Kibana |
| AI/ML | Python Price Prediction Engine |

---

## 🚀 Engineering Highlights

### Microservices Architecture

- Designed a distributed architecture comprising **9 Spring Boot microservices**
- Implemented centralized configuration management using Spring Cloud Config Server
- Enabled service registration and discovery through Eureka Server
- Configured API Gateway for request routing and service abstraction
- Applied event-driven communication using Apache Kafka

### DevSecOps Automation

- Built a fully automated **10-stage CI/CD pipeline**
- Integrated GitHub Webhooks with Jenkins
- Automated testing, Docker builds, security scanning, and deployments
- Implemented Docker Scout vulnerability scanning
- Automated release workflows using Ansible Playbooks

### Kubernetes Deployment

- Deployed and managed **19 containerized workloads**
- Configured Horizontal Pod Autoscaling (HPA)
- Implemented rolling updates and self-healing deployments
- Utilized ConfigMaps and Kubernetes Secrets
- Automated infrastructure provisioning through Infrastructure as Code practices

### Security & Observability

- Secured application credentials using HashiCorp Vault and Ansible Vault
- Implemented Kubernetes Secret management
- Established centralized logging through the ELK Stack
- Enabled real-time monitoring and troubleshooting across services

---

## 🔄 DevSecOps Pipeline

```text
Developer Push
       │
       ▼
GitHub Webhook
       │
       ▼
    Jenkins
       │
 ┌───────────────┐
 │ Source Code   │
 └───────────────┘
       │
       ▼
  Unit Testing
       │
       ▼
 Docker Build
       │
       ▼
 Security Scan
       │
       ▼
 Docker Registry
       │
       ▼
 Manifest Validation
       │
       ▼
 Ansible Deployment
       │
       ▼
 Kubernetes Cluster
       │
       ▼
  Smoke Testing
       │
       ▼
 Production Release
```

---

## ☸️ Kubernetes Features

- Deployments
- Services
- ConfigMaps
- Kubernetes Secrets
- Rolling Updates
- Horizontal Pod Autoscaling
- Namespace Isolation
- Service Discovery
- Self-Healing Pods
- Load Balancing

---

## 🔐 Security Architecture

The platform follows a DevSecOps-first approach by integrating security throughout the development and deployment lifecycle.

### Security Components

- HashiCorp Vault
- Ansible Vault
- Kubernetes Secrets
- Docker Scout Security Scanning
- Secure Credential Injection
- Environment-Based Configuration Management

---

## 📊 Observability & Monitoring

The ELK Stack is used to provide centralized observability across the platform.

### Elasticsearch

Stores and indexes application logs.

### Logstash

Processes and transforms log events.

### Kibana

Provides:

- Searchable dashboards
- Error analysis
- Log visualization
- Infrastructure monitoring
- Application troubleshooting

---

## 📂 Project Structure

```text
FinTechDevOps/
│
├── frontend/
│
├── backend/
│   ├── api-gateway/
│   ├── config-server/
│   ├── discovery-server/
│   ├── auth-service/
│   ├── user-service/
│   ├── trade-service/
│   ├── portfolio-service/
│   ├── risk-service/
│   ├── audit-service/
│   └── notification-service/
│
├── ai-price-prediction/
│
├── jenkins/
│
├── ansible/
│
├── kubernetes/
│
├── elk/
│
└── README.md
```

---

## ⚙️ Getting Started

### Clone Repository

```bash
git clone https://github.com/AmanKakadiya301/FinTechDevOps.git
cd FinTechDevOps
```

### Run with Docker Compose

```bash
docker compose up --build
```

### Deploy on Kubernetes

```bash
kubectl apply -f kubernetes/
```

### Execute Ansible Automation

```bash
ansible-playbook deploy.yml
```

---

## 🎯 Learning Outcomes

This project provided practical experience with:

- Distributed Systems
- Microservices Architecture
- Cloud-Native Application Development
- Kubernetes Administration
- DevSecOps Practices
- Infrastructure as Code
- Event-Driven Systems
- CI/CD Automation
- Application Security
- Observability and Monitoring

---

## 🔮 Future Enhancements

- Prometheus & Grafana Integration
- GitOps using ArgoCD
- AWS EKS Deployment
- Istio Service Mesh
- Advanced Trading Analytics
- Enhanced AI Prediction Models
- Multi-Cluster Kubernetes Support

---

## 👨‍💻 Author

**Aman Kakadiya**

M.Tech Computer Science (AI & ML)  
International Institute of Information Technology Bangalore (IIIT-B)

- LinkedIn: https://www.linkedin.com/in/amankakadiya/
- GitHub: https://github.com/AmanKakadiya301

---

## 📄 License

This project was developed independently as a personal academic project for learning and portfolio purposes.

Copyright © 2026 Aman Kakadiya.

---

<div align="center">

⭐ If you found this project interesting, consider giving it a star.

</div>
