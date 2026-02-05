import * as http from 'http';
import * as https from 'https';

import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

/**
 * Grafana Metrics Reporter
 * Pushes test metrics to InfluxDB for Grafana visualization
 */
export class GrafanaMetricsReporter implements Reporter {
  private readonly influxUrl: string;
  private readonly influxDb: string;
  private readonly influxUser?: string;
  private readonly influxPassword?: string;
  private testResults: Array<{
    name: string;
    status: string;
    duration: number;
    browser: string;
    timestamp: number;
  }> = [];

  constructor() {
    this.influxUrl = process.env.INFLUX_URL || 'http://localhost:8086';
    this.influxDb = process.env.INFLUX_DB || 'playwright_metrics';
    this.influxUser = process.env.INFLUX_USER;
    this.influxPassword = process.env.INFLUX_PASSWORD;
  }

  /**
   * Called once before running tests
   */
  onBegin(_config: FullConfig, _suite: Suite): void {
    // Initialize metrics collection
  }

  /**
   * Called after a test has been finished
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    const project = test.parent.project()?.name || 'unknown';
    this.testResults.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      browser: project,
      timestamp: Date.now(),
    });
  }

  /**
   * Called after all tests have been run
   */
  async onEnd(result: FullResult): Promise<void> {
    await this.pushMetrics(result);
  }

  /**
   * Push metrics to InfluxDB
   * @param result - Full test result
   */
  private async pushMetrics(result: FullResult): Promise<void> {
    if (this.testResults.length === 0) {
      return;
    }

    const lines: string[] = [];

    // Test execution metrics
    lines.push(
      `test_execution,status=total duration=${result.duration},tests=${result.status === 'passed' ? 1 : 0} ${Date.now()}000000`
    );

    // Individual test metrics
    for (const testResult of this.testResults) {
      const status = testResult.status === 'passed' ? 1 : 0;
      const line = `test_result,name="${testResult.name}",browser="${testResult.browser}",status="${testResult.status}" duration=${testResult.duration},passed=${status} ${testResult.timestamp}000000`;
      lines.push(line);
    }

    // Summary metrics
    const passed = this.testResults.filter((r) => r.status === 'passed').length;
    const failed = this.testResults.filter((r) => r.status === 'failed').length;
    const total = this.testResults.length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    lines.push(
      `test_summary passed=${passed},failed=${failed},total=${total},pass_rate=${passRate} ${Date.now()}000000`
    );

    const data = lines.join('\n');

    try {
      await this.writeToInfluxDB(data);
    } catch (error) {
      console.error('Failed to push metrics to Grafana:', error);
    }
  }

  /**
   * Write data to InfluxDB
   * @param data - Line protocol data
   */
  private async writeToInfluxDB(data: string): Promise<void> {
    const url = new URL(`${this.influxUrl}/write`);
    url.searchParams.append('db', this.influxDb);
    if (this.influxUser && this.influxPassword) {
      url.searchParams.append('u', this.influxUser);
      url.searchParams.append('p', this.influxPassword);
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
          resolve();
        } else {
          reject(new Error(`InfluxDB request failed with status ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }
}
