import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';

import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

/** Walk up the suite tree to find the project (browser) name; TestCase has no project(), Suite does. */
function getProjectName(test: TestCase): string {
  let suite: Suite | undefined = test.parent;
  while (suite) {
    const project = suite.project();
    if (project?.name) return project.name;
    suite = suite.parent;
  }
  return 'unknown';
}

export class InfluxDBReporter implements Reporter {
  private writeApi: WriteApi | null = null;
  private client: InfluxDB | null = null;
  private enabled = false;
  private env: string;
  private runId: string;
  private runNumber: string;
  private browser: string;
  private project: string;
  private suite: string;
  private testName: string;
  private testStatus: string;
  private testDuration: number;
  private testRetryCount: number;
  private testPassed: number;
  private testFailed: number;
  private testSkipped: number;
  private testError: string;

  constructor() {
    this.env = process.env.ENV || process.env.NODE_ENV || 'local';
    this.runId = process.env.RUN_ID || 'unknown';
    this.runNumber = process.env.RUN_NUMBER || 'unknown';
    this.browser = process.env.BROWSER || 'unknown';
    this.project = process.env.PROJECT || 'unknown';
    this.suite = process.env.SUITE || 'unknown';
    this.testName = process.env.TEST_NAME || 'unknown';
    this.testStatus = process.env.TEST_STATUS || 'unknown';
    this.testDuration = Number(process.env.TEST_DURATION) || 0;
    this.testRetryCount = Number(process.env.TEST_RETRY_COUNT) || 0;
    this.testPassed = Number(process.env.TEST_PASSED) || 0;
    this.testFailed = Number(process.env.TEST_FAILED) || 0;
    this.testSkipped = Number(process.env.TEST_SKIPPED) || 0;
    this.testError = process.env.TEST_ERROR || 'unknown';
  }

  private isConfigured(): boolean {
    const url = process.env.INFLUX_URL;
    const token = process.env.INFLUX_TOKEN;
    return Boolean(url && token && this.env && this.runId && this.runNumber && this.browser && this.project && this.suite && this.testName && this.testStatus && this.testDuration && this.testRetryCount && this.testPassed && this.testFailed && this.testSkipped && this.testError);
  }

  onBegin(_config: FullConfig, _suite: Suite): void {
    if (!this.isConfigured()) {
      return;
    }
    try {
      const url = process.env.INFLUX_URL!;
      const token = process.env.INFLUX_TOKEN!;
      this.client = new InfluxDB({ url, token });
      const org = process.env.INFLUX_ORG || 'superbet';
      const bucket = process.env.INFLUX_BUCKET || 'playwright_metrics';
      this.writeApi = this.client.getWriteApi(org, bucket, 'ms');
      this.enabled = true;
      console.log('[InfluxDBReporter] Metrics initialized successfully.');
      console.log('[InfluxDBReporter] Env:', this.env);
      console.log('[InfluxDBReporter] Run ID:', this.runId);
      console.log('[InfluxDBReporter] Run Number:', this.runNumber);
      console.log('[InfluxDBReporter] Browser:', this.browser);
      console.log('[InfluxDBReporter] Project:', this.project);
      console.log('[InfluxDBReporter] Suite:', this.suite);
      console.log('[InfluxDBReporter] Test Name:', this.testName);
      console.log('[InfluxDBReporter] Test Status:', this.testStatus);
      console.log('[InfluxDBReporter] Test Duration:', this.testDuration);
      console.log('[InfluxDBReporter] Test Retry Count:', this.testRetryCount);
      console.log('[InfluxDBReporter] Test Passed:', this.testPassed);
      console.log('[InfluxDBReporter] Test Failed:', this.testFailed);
      console.log('[InfluxDBReporter] Test Skipped:', this.testSkipped);
      console.log('[InfluxDBReporter] Test Error:', this.testError);
    } catch (err) {
      console.warn('[InfluxDBReporter] Failed to initialize:', (err as Error).message);
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.enabled || !this.writeApi) return;

    try {
      const suiteName = this.getSuiteName(test);
      const point = new Point('test_execution')
        .tag('test_name', this.sanitizeTag(test.title))
        .tag('browser', getProjectName(test))
        .tag('suite', this.sanitizeTag(suiteName))
        .tag('status', result.status)
        .tag('environment', this.env)
        .tag('run_id', this.runId)
        .tag('run_number', this.runNumber)
        .tag('browser', this.browser)
        .tag('project', this.project)
        .tag('suite', this.suite)
        .tag('test_name', this.testName)
        .tag('test_status', this.testStatus)
        .tag('test_duration', String(this.testDuration))
        .tag('test_retry_count', String(this.testRetryCount))
        .tag('test_passed', String(this.testPassed))
        .tag('test_failed', String(this.testFailed))
        .tag('test_skipped', String(this.testSkipped))
        .tag('test_error', this.testError)
        .intField('duration_ms', Math.round(result.duration))
        .uintField('retry_count', result.retry)
        .intField('passed', result.status === 'passed' ? 1 : 0)
        .intField('failed', result.status === 'failed' ? 1 : 0)
        .timestamp(new Date());

      this.writeApi.writePoint(point);
    } catch (err) {
      console.warn('[InfluxDBReporter] Failed to write point:', (err as Error).message);
    }
  }

  async onEnd(): Promise<void> {
    if (!this.writeApi || !this.client) return;

    try {
      await this.writeApi.close();
      this.writeApi = null;
      this.client = null;
      this.enabled = false;
      console.log('[InfluxDBReporter] Metrics pushed to InfluxDB successfully.');
    } catch (err) {
      console.warn('[InfluxDBReporter] Failed to flush/close:', (err as Error).message);
    }
  }

  private getSuiteName(test: TestCase): string {
    const titles: string[] = [];
    let parent: Suite | undefined = test.parent;
    while (parent) {
      const t = parent.title?.trim();
      if (t) titles.unshift(t);
      parent = parent.parent;
    }
    return titles.length > 0 ? titles.join(' > ') : 'default';
  }

  /** InfluxDB tag values cannot contain comma, equals, or space; keep readable. */
  private sanitizeTag(value: string, maxLen = 200): string {
    const s = String(value ?? '')
      .replace(/[,=\s]+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, maxLen);
    return s || 'unknown';
  }
}

export default InfluxDBReporter;
