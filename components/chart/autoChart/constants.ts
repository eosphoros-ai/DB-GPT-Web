import type { ChartType } from './types';

export const CHARTS_CHINESE_NAME: Record<ChartType, string> = {
  stacked_column_chart: '堆叠柱状图',
  column_chart: '柱状图',
  percent_stacked_column_chart: '百分比堆叠柱状图',
  grouped_column_chart: '簇形柱状图',
  time_column: '簇形柱状图',
  pie_chart: '饼图',
  time_pie_chart: '饼图',
  line_chart: '折线图',
  line_tech_vis: '折线图',
  line_bar_mix: '双轴图',
  area_chart: '面积图',
  stacked_area_chart: '堆叠面积图',
  scatter_plot: '散点图',
  bubble_chart: '气泡图',
  stacked_bar_chart: '堆叠条形图',
  bar_chart: '条形图',
  percent_stacked_bar_chart: '百分比堆叠条形图',
  grouped_bar_chart: '簇形条形图',
  water_fall_chart: '瀑布图',
  table: '表格',
  statistic_card: '指标卡',
  group_column_tech_vis: '柱状图',
  line_bar_mix_no_time: '双轴图',
  indicator_line_chart: '指标趋势图',
  indicator_chart: '指标卡',
};

/** 用于外界获知，组件都能推荐什么图表类型 */
export const CHARTS_NAME = Object.keys(CHARTS_CHINESE_NAME);

export const STANDARD_CHARTS_NAME = {
  pie_chart: 'pie_chart',
  line_tech_vis: 'line_chart',
  area_chart: 'area_chart',
  stacked_area_chart: 'area_chart',
  time_column: 'column_chart',
  time_pie_chart: 'pie_chart',
  grid_sheet: 'grid_sheet',
  group_column_tech_vis: 'column_chart',
  bubble_chart: 'bubble_chart',
  line_chart: 'line_chart',
  water_fall_chart: 'water_fall_chart',
  line_bar_mix_no_time: 'dual_axis_chart',
  scatter_plot: 'scatter_plot',
  indicator_line_chart: 'trend_indicator',
};
