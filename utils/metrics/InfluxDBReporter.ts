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

/**
 * Playwright reporter that writes test execution metrics to InfluxDB 2.x.
 * Set INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET to enable.
 */
export class InfluxDBReporter implements Reporter {
  private writeApi: WriteApi | null = null;
  private client: InfluxDB | null = null;
  private enabled = false;
  private env: string;

  constructor() {
    this.env = process.env.ENV || process.env.NODE_ENV || 'local';
  }

  private isConfigured(): boolean {
    const url = process.env.INFLUX_URL;
    const token = process.env.INFLUX_TOKEN;
    return Boolean(url && token);
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
