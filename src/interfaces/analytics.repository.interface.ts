// src/analytics/interfaces/analytics-repository.interface.ts

export interface IAnalyticsRepository {
  writeResourceUsage(
    containerId: string,
    cpuUsage: number,
    memoryUsage: number,
    timestamp?: Date,
  ): Promise<void>;
  queryResourceUsage(
    containerId: string,
    start: string,
    stop: string,
  ): Promise<any[]>;
}
