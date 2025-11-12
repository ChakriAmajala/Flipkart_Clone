pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node23'
    }

    environment {
        DOCKERHUB_USER = 'chakriamajaladocker'
        IMAGE_NAME = 'flipkart_clone'
        HOST_PORT = "4000"
        CONTAINER_PORT = "4000"  // ✅ Matches Dockerfile/app
        SCANNER_HOME = tool 'sonar-scanner'
        AWS_REGION = 'ap-south-1'
        SONAR_HOST_URL = 'http://3.27.219.50:9090/'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'master', url: 'https://github.com/ChakriAmajala/Flipkart_Clone.git'
                sh 'ls -la'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonarr', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        echo "🔍 Running SonarQube analysis..."
                        ${SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=Flipkart_Clone \
                          -Dsonar.projectName=Flipkart_Clone \
                          -Dsonar.host.url=$SONAR_HOST_URL \
                          -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        set -e
                        echo "🐳 Building Docker image..."
                        docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:latest .
                    '''
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: ']()
