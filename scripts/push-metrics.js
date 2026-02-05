/**
 * Push metrics to Grafana/InfluxDB
 * Can be run standalone or as part of CI/CD pipeline
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const INFLUX_URL = process.env.INFLUX_URL || 'http://localhost:8086';
const INFLUX_DB = process.env.INFLUX_DB || 'playwright_metrics';
const INFLUX_USER = process.env.INFLUX_USER;
const INFLUX_PASSWORD = process.env.INFLUX_PASSWORD;

/**
 * Read test results from JSON file
 */
function readTestResults() {
  const resultsPath = path.join(__dirname, '..', 'test-results', 'results.json');
  if (!fs.existsSync(resultsPath)) {
    console.error('Test results file not found:', resultsPath);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
}

/**
 * Push metrics to InfluxDB
 */
function pushMetrics(data) {
  const url = new URL(`${INFLUX_URL}/write`);
  url.searchParams.append('db', INFLUX_DB);
  if (INFLUX_USER && INFLUX_PASSWORD) {
    url.searchParams.append('u', INFLUX_USER);
    url.searchParams.append('p', INFLUX_PASSWORD);
  }

  const isHttps = url.protocol === 'https:';
  const httpModule = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const req = httpModule.request(url.toString(), options, (res) => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log('Metrics pushed successfully');
        resolve();
      } else {
        reject(new Error(`Failed to push metrics: ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    const results = readTestResults();
    const lines = [];

    // Process test results and create InfluxDB line protocol
    results.suites?.forEach((suite) => {
      suite.specs?.forEach((spec) => {
        spec.tests?.forEach((test) => {
          test.results?.forEach((result) => {
            const status = result.status === 'passed' ? 1 : 0;
            const line = `test_result,name="${test.title}",status="${result.status}" duration=${result.duration},passed=${status} ${Date.now()}000000`;
            lines.push(line);
          });
        });
      });
    });

    if (lines.length > 0) {
      await pushMetrics(lines.join('\n'));
    } else {
      console.log('No test results to push');
    }
  } catch (error) {
    console.error('Error pushing metrics:', error);
    process.exit(1);
  }
}

main();
