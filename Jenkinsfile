node {
    env.NODEJS_HOME = "${tool 'Node12'}"
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"

    def commit_id
    def tag_name
    def branch_name
    def portainerToken

    try {
        stage('Preparation') {
            checkout scm
        }

        stage('Install packages') {
            withCredentials([string(credentialsId: 'NpmToken', variable: 'TOKEN')]) {
                sh 'NPM_TOKEN=$TOKEN npm install'
            }
        }

//         stage('Unit tests') {
//             withCredentials([string(credentialsId: 'NpmToken', variable: 'TOKEN')]) {
//                 sh 'NPM_TOKEN=$TOKEN npm test -- --ci --testResultsProcessor="jest-junit"'
//                 junit 'junit.xml'
//             }
//         }

        stage('Lint') {
            withCredentials([string(credentialsId: 'NpmToken', variable: 'TOKEN')]) {
                sh 'NPM_TOKEN=$TOKEN npm run lint'
            }
        }

//         stage('Npm update') {
//             withCredentials([string(credentialsId: 'NpmToken', variable: 'TOKEN')]) {
//                 sh 'NPM_TOKEN=$TOKEN npm run publish'
//             }
//         }

        stage('Git push') {
            sh(returnStdout: true, script: 'push-npm.sh')
        }
    } catch (e) {
        // mark build as failed
        currentBuild.result = "FAILURE";

        // mark current build as a failure and throw the error
        throw e;
    }
}
