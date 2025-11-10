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
        SCANNER_HOME = tool 'sonar-scanner'
        AWS_REGION = 'ap-south-1'
        SONAR_HOST_URL = 'http://13.211.160.23:9090/'
        
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
                        echo "Running SonarQube analysis..."
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
                    sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:latest ."
                }
            }
        }


        stage('Login to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh "docker rm -f flipkart_clone|| true"
                    sh "docker run -d --name flipkart_clone -p ${HOST_PORT}:${CONTAINER_PORT} ${DOCKERHUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

    post {
        always {
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>" +
                      "Build Number: ${env.BUILD_NUMBER}<br/>" +
                      "URL: ${env.BUILD_URL}<br/>",
                to: 'chakridevopsengineer@gmail.com'
        }
    }
}

