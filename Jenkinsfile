pipeline {
    agent any

    environment {
        AWS_REGION     = 'ap-south-1'
        AWS_ACCOUNT_ID = '049706518268'
        ECR_REPO_NAME  = 'project-node-app'
        EC2_HOST       = '13.232.2.110'

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME   = "${ECR_REPO_NAME}"
        IMAGE_TAG    = "build-${env.BUILD_NUMBER}"
        FULL_IMAGE   = "${ECR_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
        LATEST_IMAGE = "${ECR_REGISTRY}/${IMAGE_NAME}:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                sh 'ls -la'
            }
        }

        stage('AWS Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-ecr-creds',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=${AWS_REGION}

                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Build Image') {
            steps {
                sh """
                    docker build -t ${FULL_IMAGE} -t ${LATEST_IMAGE} .
                """
            }
        }

        stage('Push to ECR') {
            steps {
                sh """
                    docker push ${FULL_IMAGE}
                    docker push ${LATEST_IMAGE}
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY ubuntu@${EC2_HOST} '
                            aws ecr get-login-password --region ${AWS_REGION} \
                                | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                            docker pull ${LATEST_IMAGE}

                            if [ \$(docker ps -q -f name=project-node-app | wc -l) -gt 0 ]; then
                                docker stop project-node-app
                                docker rm project-node-app
                            fi

                            docker run -d --name project-node-app -p 80:5000 ${LATEST_IMAGE}
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "===== Deployment Finished Successfully ====="
        }
        failure {
            echo "===== Deployment Failed ====="
        }
    }
}
