pipeline {
    agent any
    
    tools {nodejs "NodeJS 12.18.4"}

    stages {
        stage("Dependencies"){
            steps {
                sh 'npm install' 
            }
        }
        stage('Build') { 
            steps {
                sh "sudo cp /var/www/env/moodtrack-frontend/.env.production ."
                sh "cat .env.production"
                sh 'npm run build'
            }
        }
        stage('Artifacts'){
            steps {
                dir('./dist'){
                    stash 'dist'   
                }
                
            }
        }
        stage('Deploy'){
           steps {       
                dir('/var/www/moodtrack-frontend'){
                    sh 'rm -rf {*,.*}'
                    unstash 'dist'
                }
           }
        }
    }
}