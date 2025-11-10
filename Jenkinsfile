pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node23'
    }

    environment {
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
                git branch: 'main', url: 'https://github.com/ChakriAmajala/Flipkart_Clone.git'
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


        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh '''
                        echo "Building Docker image for Flipkart_Clone..."
                        docker build -t flipkart_clone:latest .

                        echo "Pushing Docker image to Docker Hub..."
                        docker push flipkart_clone:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to Container') {
            steps {
                sh '''
                echo "Stopping old container if running..."
                docker stop flipkart || true
                docker rm flipkart || true

                echo "Running new Flipkart container on port 4000..."
                docker run -d --restart=always --name flipkart -p 4000:4000 flipkart_clone:latest

                echo "Container logs..."
                sleep 5
                docker logs flipkart
                '''
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

