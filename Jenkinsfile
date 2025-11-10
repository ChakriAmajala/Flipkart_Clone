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
        CONTAINER_PORT = "4000"  // ✅ Fixed to match Dockerfile and app
        SCANNER_HOME = tool 'sonar-scanner'
        AWS_REGION = 'ap-south-1'
        SONAR_HOST_URL = 'http://3.106.204.72:9090/'
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
                    withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                        echo "🔐 Logging in to Docker Hub..."
                        echo $PASS | docker login -u $USER --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                echo "📤 Pushing image to Docker Hub..."
                docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh '''
                    echo "🚀 Deploying container..."

                    # Stop and remove old container if exists
                    docker rm -f flipkart_clone || true

                    # Run new container with correct ports
                    docker run -d --name flipkart_clone -p ${HOST_PORT}:${CONTAINER_PORT} ${DOCKERHUB_USER}/${IMAGE_NAME}:latest

                    echo "✅ Deployment complete. Checking containers..."
                    docker ps -a
                    '''
                }
            }
        }
    }

    post {
        always {
            emailext(
                attachLog: true,
                subject: "'${currentBuild.result}' - Flipkart_Clone Pipeline",
                body: """<b>Project:</b> ${env.JOB_NAME}<br/>
                         <b>Build Number:</b> ${env.BUILD_NUMBER}<br/>
                         <b>URL:</b> ${env.BUILD_URL}<br/>""",
                to: 'chakridevopsengineer@gmail.com'
            )
        }
    }
}
