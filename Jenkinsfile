pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
                sh 'git rev-parse HEAD'
            }
        }
        
        stage('Build and Test') {
            parallel {
                stage('Server Pipeline') {
                    steps {
                        script {
                            echo 'Building Server...'
                            dir('server') {
                                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                                    sh 'node --version'
                                    sh 'npm --version'
                                    sh 'npm ci'
                                    sh 'npm run build'
                                }
                            }
                        }
                    }
                }
                
                stage('Client Pipeline') {
                    steps {
                        script {
                            echo 'Building Client...'
                            dir('client') {
                                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                                    sh 'node --version'
                                    sh 'npm --version'
                                    sh 'npm ci'
                                    sh 'npm run lint || true'
                                    sh 'npm run build'
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Docker Build') {
            parallel {
                stage('Build Server Image') {
                    steps {
                        script {
                            echo 'Building Server Docker Image...'
                            dir('server') {
                                sh """
                                    docker build \
                                        -t ${DOCKER_REGISTRY}/code-sync-server:${IMAGE_TAG} \
                                        -t ${DOCKER_REGISTRY}/code-sync-server:latest \
                                        -t ${DOCKER_REGISTRY}/code-sync-server:${GIT_COMMIT_SHORT} \
                                        --target runner \
                                        .
                                """
                            }
                        }
                    }
                }
                
                stage('Build Client Image') {
                    steps {
                        script {
                            echo 'Building Client Docker Image...'
                            dir('client') {
                                sh """
                                    docker build \
                                        -t ${DOCKER_REGISTRY}/code-sync-client:${IMAGE_TAG} \
                                        -t ${DOCKER_REGISTRY}/code-sync-client:latest \
                                        -t ${DOCKER_REGISTRY}/code-sync-client:${GIT_COMMIT_SHORT} \
                                        --target runner \
                                        .
                                """
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Pushing Docker Images to Registry...'
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-server:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-server:latest"
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-server:${GIT_COMMIT_SHORT}"
                        
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-client:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-client:latest"
                        sh "docker push ${DOCKER_REGISTRY}/code-sync-client:${GIT_COMMIT_SHORT}"
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Deploying application...'
                    // Add your deployment steps here
                    // Example: Deploy to Kubernetes, Docker Swarm, or update docker-compose
                    sh """
                        docker-compose down || true
                        docker-compose pull
                        docker-compose up -d
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
