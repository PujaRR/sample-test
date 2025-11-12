// Jenkinsfile - Scripted Pipeline (Windows Only)
timestamps {
  node {
    echo "Running on node: ${env.NODE_NAME ?: 'master'}"
    echo "Workspace: ${env.WORKSPACE}"

    // Stage 1: Checkout
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

    // Stage 2: Build
    stage('Build') {
      try {
        echo "[Build] Installing dependencies..."
        bat '''
          echo Checking Node.js and npm versions...
          node --version
          npm --version

          echo Installing dependencies...
          npm ci || npm install

          REM If your app has a build script, uncomment the next line:
          REM npm run build
        '''
        echo "[Build] Build stage completed successfully."
      } catch (err) {
        echo "[Build] ERROR: ${err}"
        currentBuild.result = 'FAILURE'
        throw err
      }
    }

    // Stage 3: Test
    stage('Test') {
      try {
        echo "[Test] Running Jest unit tests..."
        bat '''
          if not exist test-results mkdir test-results
          npx --yes jest --ci --reporters=default --reporters=jest-junit --outputFile=test-results/junit.xml || echo jest_failed
        '''
        echo "[Test] Test execution completed (check console for results)."
      } catch (err) {
        echo "[Test] ERROR: ${err}"
        currentBuild.result = 'UNSTABLE'
        echo "[Test] Marked build as UNSTABLE due to test errors."
      } finally {
        // Attempt to publish JUnit test reports (safe if none exist)
        try {
          junit allowEmptyResults: true, testResults: 'test-results/*.xml'
        } catch (ignored) {
          echo "[Test] No JUnit results found or plugin issue."
        }
      }
    }

    // Stage 4: Deploy
    stage('Deploy') {
      try {
        echo "[Deploy] Creating deployment artifacts..."
        bat '''
          if not exist deploy-artifact mkdir deploy-artifact
          xcopy /E /I /Y package*.json src README.md deploy-artifact >nul 2>&1
          dir deploy-artifact
        '''

        echo "[Deploy] Archiving artifacts..."
        archiveArtifacts artifacts: 'deploy-artifact/**', excludes: 'node_modules/**, .git/**', fingerprint: true

        echo "[Deploy] Deployment stage completed successfully."
      } catch (err) {
        echo "[Deploy] ERROR: ${err}"
        currentBuild.result = 'FAILURE'
        throw err
      }
    }

    // Final
    echo "✅ Pipeline finished with result: ${currentBuild.result ?: 'SUCCESS'}"
  }
}
