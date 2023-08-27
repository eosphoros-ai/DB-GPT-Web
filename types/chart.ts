type ChartValue = {
  name: string;
  type: string;
  value: number
}

/**
 * dashboard chart type
 */
export type ChartData = {
  chart_desc: string;
  chart_name: string;
  chart_sql: string;
  chart_type: string;
  chart_uid: string;
  column_name: Array<string>
  values: Array<ChartValue>
}