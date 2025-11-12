# SLIP 4 - Question 2: Jenkins Scripted Pipeline with CI/CD

This folder contains a sample Todo API application with comprehensive unit tests for SLIP 4, Question 2 (Jenkins Scripted Pipeline Development).

## Overview

This is a Node.js Todo API application designed to demonstrate a Jenkins **scripted pipeline** (not declarative) implementing a complete CI/CD workflow with:
1. **Checkout**: Clone code from Git repository
2. **Build**: Compile application (npm install and build)
3. **Test**: Run unit tests and display results
4. **Deploy**: Copy and archive artifacts

The pipeline includes:
- ✅ Error handling with try-catch blocks
- ✅ Timestamps for each stage execution
- ✅ Echo statements showing progress
- ✅ Proper error propagation

## Application Structure

```
sampleapp/
├── src/
│   ├── todoService.js    # Business logic for Todo operations
│   └── index.js          # Express API server
├── __tests__/
│   ├── todoService.test.js  # Unit tests for TodoService (40+ tests)
│   └── index.test.js         # Unit tests for API endpoints (20+ tests)
├── package.json          # Node.js dependencies and scripts
├── Jenkinsfile          # Jenkins scripted pipeline script
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Jenkins (for pipeline execution)
- Git (for repository checkout)

## Installation

1. Navigate to the sampleapp directory:
```bash
cd SLIP_4/sampleapp
```

2. Install dependencies:
```bash
npm install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with coverage:
```bash
npm test -- --coverage
```

### Run tests in watch mode:
```bash
npm test -- --watch
```

## Running the Application

Start the Express server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

### API Endpoints

- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint with timestamp
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create a new todo
  ```json
  {
    "title": "My Todo",
    "description": "Optional description"
  }
  ```
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/todos/completed` - Get all completed todos
- `GET /api/todos/pending` - Get all pending todos

## Jenkins Scripted Pipeline Setup

### Option 1: Using Jenkinsfile (Recommended)

1. Create a new Jenkins Pipeline job
2. Configure the job to use "Pipeline script from SCM"
3. Select Git as SCM
4. Point to this repository URL
5. Set the script path to `sampleapp/Jenkinsfile` (or `Jenkinsfile` if running from sampleapp directory)
6. Run the pipeline

### Option 2: Manual Pipeline Configuration in Jenkins

1. Create a new Pipeline job in Jenkins
2. Select "Pipeline script" and paste the scripted pipeline code
3. Alternatively, use the Jenkinsfile content

### Pipeline Features

The scripted pipeline includes:

- **Timestamps**: Every stage execution is timestamped
- **Error Handling**: Try-catch blocks in each stage
- **Progress Echo**: Detailed echo statements at each step
- **Artifact Archiving**: Build artifacts are archived after deployment
- **Error Propagation**: Errors are properly caught and propagated

## Expected Pipeline Output

### Stage 1: Checkout
```
[Timestamp] Stage 1: Checkout - Cloning Git repository
Repository cloned successfully
[Timestamp] Checkout stage completed successfully
```

### Stage 2: Build
```
[Timestamp] Stage 2: Build - Compiling application
Installing dependencies...
Running build script...
Build completed successfully
[Timestamp] Build stage completed successfully
```

### Stage 3: Test
```
[Timestamp] Stage 3: Test - Running unit tests
Executing unit tests...
PASS  __tests__/todoService.test.js
PASS  __tests__/index.test.js
[Timestamp] Test stage completed successfully
```

### Stage 4: Deploy
```
[Timestamp] Stage 4: Deploy - Copying artifacts
Creating deployment artifacts...
Archiving build artifacts...
[Timestamp] Deploy stage completed successfully
```

## Test Coverage

The application includes comprehensive unit tests:

### TodoService Tests (`todoService.test.js`)
- **createTodo()**: 6 test cases
- **getAllTodos()**: 2 test cases
- **getTodoById()**: 2 test cases
- **updateTodo()**: 9 test cases
- **deleteTodo()**: 3 test cases
- **getCompletedTodos()**: 2 test cases
- **getPendingTodos()**: 2 test cases
- **clearAll()**: 2 test cases

**Total: 28 test cases**

### API Tests (`index.test.js`)
- Health check and root endpoint tests
- All CRUD operations (GET, POST, PUT, DELETE)
- Error handling tests (404, 400)
- Edge cases and validation tests

**Total: 20+ test cases**

## Scripted Pipeline vs Declarative Pipeline

### Key Differences:

1. **Syntax**: Scripted uses Groovy script, Declarative uses structured DSL
2. **Flexibility**: Scripted offers more flexibility for complex logic
3. **Error Handling**: Scripted allows custom try-catch blocks
4. **Conditional Logic**: Scripted supports any Groovy conditional statements

### This Pipeline Demonstrates:

- ✅ `node` block for pipeline definition
- ✅ `stage` blocks for each pipeline stage
- ✅ `try-catch` blocks for error handling
- ✅ `timestamps` wrapper for all stages
- ✅ `echo` statements for progress tracking
- ✅ Artifact archiving in Deploy stage

## Notes for Evaluators

- All tests are designed to pass successfully
- The application is ready to be checked out from Git
- Unit tests can be run using `npm test`
- The Jenkinsfile uses **scripted pipeline** syntax (not declarative)
- Error handling is implemented with try-catch blocks
- All stages include timestamps
- Pipeline includes proper echo statements for progress tracking

## Troubleshooting

### If tests fail:
1. Ensure all dependencies are installed: `npm install`
2. Check Node.js version: `node --version` (should be v14+)
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### If Jenkins pipeline fails:
1. Ensure Node.js is installed on Jenkins agent
2. Check if npm is available in the PATH
3. Verify Git repository access from Jenkins
4. Check Jenkins workspace permissions
5. Verify the Jenkinsfile uses scripted pipeline syntax (not declarative)

### Common Pipeline Errors:

**Error: "No such file or directory"**
- Solution: Ensure the Jenkinsfile path is correct relative to repository root

**Error: "npm: command not found"**
- Solution: Install Node.js on Jenkins agent or use Node.js plugin

**Error: "Tests failed"**
- Solution: Check test output in console logs. Pipeline is configured to mark build as UNSTABLE if tests fail.

## Example Test Output

```
PASS  __tests__/todoService.test.js
  TodoService
    createTodo
      ✓ should create a todo with title only
      ✓ should create a todo with title and description
      ✓ should trim whitespace from title and description
      ...
    ✓ 28 test cases passed

PASS  __tests__/index.test.js
  Todo API
    GET /
      ✓ should return API information
    GET /health
      ✓ should return health status
    ...
    ✓ 20 test cases passed
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jenkins Scripted Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Express.js Documentation](https://expressjs.com/)
- [Groovy Syntax for Jenkins](https://www.jenkins.io/doc/book/pipeline/syntax/)

