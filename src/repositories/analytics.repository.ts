// src/analytics/repositories/analytics.repository.ts

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import { IAnalyticsRepository } from 'src/interfaces/analytics.repository.interface';

@Injectable()
export class AnalyticsRepository
  implements IAnalyticsRepository, OnModuleDestroy
{
  private client: InfluxDB;
  private writeApi: WriteApi;
  private queryApi;
  private org = process.env.INFLUXDB_ORG;
  private bucket = process.env.INFLUXDB_BUCKET;

  constructor() {
    const url = process.env.INFLUXDB_URL;
    const token = process.env.INFLUXDB_TOKEN;
    this.client = new InfluxDB({ url, token });
    this.writeApi = this.client.getWriteApi(this.org, this.bucket);
    this.queryApi = this.client.getQueryApi(this.org);
  }

  async writeResourceUsage(
    containerId: string,
    cpuUsage: number,
    memoryUsage: number,
    timestamp = new Date(),
  ): Promise<void> {
    const point = new Point('resource_usage')
      .tag('containerId', containerId)
      .floatField('cpuUsage', cpuUsage)
      .floatField('memoryUsage', memoryUsage)
      .timestamp(timestamp);

    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }

  async queryResourceUsage(
    containerId: string,
    start: string,
    stop: string,
  ): Promise<any[]> {
    const query = `
      from(bucket: "${this.bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r._measurement == "resource_usage" and r.containerId == "${containerId}")
        |> yield(name: "usage")
    `;

    const rows = [];
    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          rows.push(o);
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve(rows);
        },
      });
    });
  }

  onModuleDestroy() {
    this.writeApi.close().catch((err) => {
      console.error('Error closing writeApi', err);
    });
  }
}
