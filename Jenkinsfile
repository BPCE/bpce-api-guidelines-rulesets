pipeline  {
    agent {
        docker {
            image '$NODE_IMAGE'
            label 'generic-slave'
        }
    }

    triggers {
    GenericTrigger(
        genericVariables: [
            [key: 'EVENT_KEY', value: '$.eventKey'],
            [key: 'BRANCH_REF', value: '$.pullRequest.fromRef.id'],
            [key: 'PR_VERSION', value: '$.pullRequest.version'],
            [key: 'PR_TITLE', value: '$.pullRequest.title'],
            [key: 'PR_AUTHOR', value: '$.pullRequest.author.user.name'],
            [key: 'BRANCH_NAME', value: '$.pullRequest.fromRef.displayId']
        ],

        causeString: 'Pull Request Review',

        token: 'api-linter-pr-review',

        printContributedVariables: true,
        printPostContent: true,

        silentResponse: false,

        regexpFilterText: '${EVENT_KEY}',
        regexpFilterExpression: '(pr:open|pr:modified|pr:from_ref_updated)'
    )
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
                checkout([$class: 'GitSCM', branches: [[name: '${BRANCH_REF}']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CloneOption', noTags: false, reference: '', shallow: false]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git_credential', url: 'https://bitbucket-mut.d.bbg/scm/eapi89c3r/api-linter.git']]])
                notifyBitbucket buildName: "${BUILD_NUMBER}", buildStatus: 'INPROGRESS', commitSha1: '', considerUnstableAsSuccess: false, credentialsId: 'git_credential', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://bitbucket.mycloud.intranatixis.com'
                buildName("${BUILD_NUMBER}-${PR_AUTHOR}-${BRANCH_NAME}-${PR_VERSION}")
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
            step([$class: 'Mailer', notifyEveryUnstableBuild: false, recipients: 'aurelien.ianni@natixis.com', sendToIndividuals: true])
            notifyBitbucket buildName: "${BUILD_NUMBER}", buildStatus: 'FAILED', commitSha1: '', considerUnstableAsSuccess: false, credentialsId: 'git_credential', disableInprogressNotification: false, ignoreUnverifiedSSLPeer: true, includeBuildNumberInKey: false, prependParentProjectKey: false, projectKey: '', stashServerBaseUrl: 'https://bitbucket.mycloud.intranatixis.com'
        }
    }
}
