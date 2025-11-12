/**
 * Deployment script
 * Copies source files to dist directory for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('Deploying artifacts...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy source files
const srcDir = path.join(__dirname, '..', 'src');
const files = ['index.js', 'todoService.js'];

files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const dstPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Copied ${file} to dist/`);
  }
});

// Copy package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJsonDest = path.join(distDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  fs.copyFileSync(packageJsonPath, packageJsonDest);
  console.log('Copied package.json to dist/');
}

console.log('Deployment artifacts created in dist/');

