timestamps {
  node {
    echo "Running on node: ${env.NODE_NAME ?: 'master'}"
    echo "Workspace: ${env.WORKSPACE}"

    // === Checkout ===
    stage('Checkout') {
      try {
        echo "[Checkout] Cloning repository..."
        checkout scm
        echo "[Checkout] Completed successfully."
      } catch (err) {
        echo "[Checkout] ERROR: ${err}"
        currentBuild.result = 'FAILURE'
        throw err
      }
    }

    // === Build ===
    stage('Build') {
      try {
        echo "[Build] Installing dependencies..."
        bat '''
          echo Checking Node.js and npm versions...
          node --version
          npm --version
          npm install
        '''
        echo "[Build] Build stage completed successfully."
      } catch (err) {
        echo "[Build] ERROR: ${err}"
        currentBuild.result = 'FAILURE'
        throw err
      }
    }

    // === Test ===
    stage('Test') {
      try {
        echo "[Test] Running Jest unit tests..."
        bat '''
          if not exist test-results mkdir test-results
          npm install --save-dev jest-junit
          npx jest --ci --reporters=default --reporters=jest-junit --outputFile=test-results/junit.xml || echo jest_failed
        '''
      } catch (err) {
        echo "[Test] ERROR: ${err}"
        currentBuild.result = 'UNSTABLE'
        echo "[Test] Marked build as UNSTABLE due to test errors."
      } finally {
        junit allowEmptyResults: true, testResults: 'test-results/*.xml'
      }
    }

    // === Deploy ===
    stage('Deploy') {
      try {
        echo "[Deploy] Creating deployment artifacts..."
        bat '''
          if not exist deploy-artifact mkdir deploy-artifact
          xcopy /E /I /Y "package*.json" "deploy-artifact\\" >nul
          xcopy /E /I /Y "src\\" "deploy-artifact\\src\\" >nul
          copy README.md deploy-artifact\\ >nul
        '''
        echo "[Deploy] Archiving artifacts..."
        archiveArtifacts artifacts: 'deploy-artifact/**', fingerprint: true
        echo "[Deploy] Deploy stage completed successfully."
      } catch (err) {
        echo "[Deploy] ERROR: ${err}"
        currentBuild.result = 'FAILURE'
        throw err
      }
    }

    echo "Pipeline finished with result: ${currentBuild.result ?: 'SUCCESS'}"
  }
}
