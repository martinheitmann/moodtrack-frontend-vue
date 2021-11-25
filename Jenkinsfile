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
                configFileProvider([configFile(fileId: 'moodtrack-firebase-web-prod', targetLocation:'', variable: 'FIREBASE_CREDENTIALS')]) {
                    sh "sudo cp $FIREBASE_CREDENTIALS ."
                    sh "cat ${env.FIREBASE_CREDENTIALS}"
                    sh 'npm run build'
                }
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