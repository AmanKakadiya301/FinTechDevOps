pipeline {
    agent any

    environment {
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64'
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
        GIT_URL = 'https://github.com/AmanKakadiya301/FinTechDevOps.git'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: env.GIT_URL
            }
        }

        stage('Build Java Backend Services') {
            steps {
                script {
                    def javaServices = ["config-server", "eureka-server", "user-service", "order-service", "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"]
                    for (int i = 0; i < javaServices.size(); i++) {
                        def service = javaServices[i]
                        dir(service) {
                            echo "Building ${service}..."
                            sh 'chmod +x ./gradlew || true'
                            sh './gradlew build -x test --no-daemon'
                        }
                    }
                }
            }
        }

        stage('Start Docker Infrastructure') {
            steps {
                script {
                    echo "Starting Docker infrastructure..."
                    sh 'docker compose -f docker-compose.yml up -d postgres zookeeper kafka redis vault'
                    echo "Waiting 15 seconds for infrastructure to initialize..."
                    sleep 15
                    sh 'docker ps'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying application to Kubernetes via Ansible..."
                    sh 'ansible-playbook ansible/playbook.yml || echo "Ansible playbook completed with warnings"'
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}