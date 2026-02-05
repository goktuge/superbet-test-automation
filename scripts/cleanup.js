/**
 * Cleanup script for test artifacts
 * Removes old test results, screenshots, and reports
 */

const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_CLEAN = [
  'test-results',
  'playwright-report',
  'allure-results',
  'allure-report',
];

/**
 * Remove directory recursively
 */
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Removed: ${dirPath}`);
  }
}

/**
 * Main cleanup function
 */
function cleanup() {
  console.log('Starting cleanup...');
  DIRECTORIES_TO_CLEAN.forEach((dir) => {
    const fullPath = path.join(__dirname, '..', dir);
    removeDir(fullPath);
  });
  console.log('Cleanup completed');
}

cleanup();
