pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        ENV = "${params.ENV ?: 'staging'}"
        BASE_URL = "${params.BASE_URL ?: 'https://staging.superbet.ro'}"
    }

    parameters {
        choice(
            name: 'ENV',
            choices: ['local', 'staging', 'prod'],
            description: 'Environment to test'
        )
        choice(
            name: 'TEST_TYPE',
            choices: ['smoke', 'regression'],
            description: 'Test type to run'
        )
        string(
            name: 'BASE_URL',
            defaultValue: 'https://staging.superbet.ro',
            description: 'Base URL for testing'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                sh '''
                    node --version
                    npm --version
                    npm ci
                    npx playwright install --with-deps chromium
                '''
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Type Check') {
            steps {
                sh 'npm run type-check'
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Chromium') {
                    steps {
                        sh '''
                            ENV=${ENV} BASE_URL=${BASE_URL} HEADLESS=true \
                            npm run test:ui:${TEST_TYPE}
                        '''
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/**/*,playwright-report/**/*,allure-results/**/*', allowEmptyArchive: true
                        }
                    }
                }
                stage('Firefox') {
                    steps {
                        sh '''
                            ENV=${ENV} BASE_URL=${BASE_URL} HEADLESS=true \
                            npx playwright test --project=firefox
                        '''
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/**/*,playwright-report/**/*,allure-results/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh 'npm run test:report:generate'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'allure-report',
                        reportFiles: 'index.html',
                        reportName: 'Allure Report'
                    ])
                }
            }
        }

        stage('Push Metrics') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh 'npm run push-metrics'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            emailext(
                subject: "Test Execution Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Test execution failed. Please check the build logs.",
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@superbet.ro'}"
            )
        }
    }
}
