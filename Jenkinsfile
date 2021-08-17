pipeline  {
    agent {
        docker {
            image '$NODE_IMAGE'
            label 'generic-slave'
        }
    }

    parameters  {
        string(name: 'NODE_IMAGE', defaultValue: 'tools/nodejs/node-v14.15.0-linux-x64:1.1.6', description: 'Image version')
    }

    options  {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
        skipStagesAfterUnstable()
    }

    stages  {
        stage('Clone') {
            steps {
                cleanWs()
                checkout([$class: 'GitSCM', branches: [[name: 'refs/heads/feature/run-tests-using-ci']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: false, reference: '', shallow: false]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git_credential', url: 'https://bitbucket-mut.d.bbg/scm/eapi89c3r/api-linter.git']]])
                notifyBitbucket buildName: "${BUILD_NUMBER}", buildStatus: 'INPROGRESS', commitSha1: '', considerUnstableAsSuccess: false, credentialsId: 'git_credential', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://bitbucket.mycloud.intranatixis.com'
            }
        }

        stage('Install') {
            steps {
                sh 'npm config set loglevel="http"'
                sh 'npm set progress=false && npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npx standard "test/*.js" --env mocha'
            }
        }

        stage('Test') {
            steps {
                sh 'npx mocha --reporter mocha-junit-reporter'
            }
        }
    }
    post {
        always {
            junit 'test-results.xml'
        }
        success {
            notifyBitbucket buildName: "${BUILD_NUMBER}", buildStatus: 'SUCCESSFUL', commitSha1: '', considerUnstableAsSuccess: false, credentialsId: 'git_credential', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://bitbucket.mycloud.intranatixis.com'
        }
        unsuccessful {
            step([$class: 'Mailer', notifyEveryUnstableBuild: false, recipients: '', sendToIndividuals: true])
            notifyBitbucket buildName: "${BUILD_NUMBER}", buildStatus: 'FAILED', commitSha1: '', considerUnstableAsSuccess: false, credentialsId: 'git_credential', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://bitbucket.mycloud.intranatixis.com'
        }
    }
}
