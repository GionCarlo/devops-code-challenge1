pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        FRONTEND_IMAGE = "devops-challenge-frontend"
        BACKEND_IMAGE = "devops-challenge-backend"
        AWS_ACCOUNT_ID = "939966404349"
        FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_IMAGE}"
        BACKEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACKEND_IMAGE}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-gioncarlo-pat',
                    url: 'https://github.com/gioncarlo/devops-code-challenge1.git'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION \
                        | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                cd frontend
                docker build -t $FRONTEND_REPO:latest .
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                cd backend
                docker build -t $BACKEND_REPO:latest .
                '''
            }
        }

        stage('Push Frontend to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh 'docker push $FRONTEND_REPO:latest'
                }
            }
        }

        stage('Push Backend to ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
                    sh 'docker push $BACKEND_REPO:latest'
                }
            }
        }

        stage('Deploy to ECS') {
    steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']]) {
            sh '''
            aws ecs update-service \
                --cluster devops-challenge-cluster \
                --service devops-challenge-frontend-service \
                --force-new-deployment \
                --region $AWS_REGION

            aws ecs update-service \
                --cluster devops-challenge-cluster \
                --service devops-challenge-backend-service \
                --force-new-deployment \
                --region $AWS_REGION
            '''
        }
    }
}
