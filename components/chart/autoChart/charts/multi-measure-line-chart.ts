import { hasSubset, intersects } from '../advisor/utils';
import { processDateEncode } from './util';
import type { ChartKnowledge, CustomChart, GetChartConfigProps, Specification } from '../types';

/* 生成图表绘制所需 config 的函数 */
const getChartSpec = (data: GetChartConfigProps['data'], dataProps: GetChartConfigProps['dataProps']) => {
  // @ts-ignore 跟 ava 内置类型相关的提示，比较难除掉
  try {
    const field4Y = dataProps?.filter((field) => hasSubset(field.levelOfMeasurements, ['Interval']));
    const field4Nominal = dataProps?.find((field) =>
      // @ts-ignore 跟 ava 内置类型相关的提示，比较难除掉
      hasSubset(field.levelOfMeasurements, ['Nominal']),
    );
    if (!field4Nominal || !field4Y) return null;

    const spec: Specification = {
      type: 'view',
      data,
      children: [],
    };

    field4Y?.forEach((field) => {
      const singleLine: Specification = {
        type: 'line',
        encode: {
          x: processDateEncode(field4Nominal.name as string, dataProps),
          y: field.name,
          color: () => field.name,
          series: () => field.name,
        },
      };
      spec.children.push(singleLine);
    });
    return spec;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const ckb: ChartKnowledge = {
  id: 'multi_measure_line_chart',
  name: 'multi_measure_line_chart',
  alias: ['multi_measure_line_chart'],
  family: ['LineCharts'],
  def: 'multi_measure_line_chart uses lines with segments to show changes in data in a ordinal dimension',
  purpose: ['Comparison', 'Distribution'],
  coord: ['Cartesian2D'],
  category: ['Statistic'],
  shape: ['Lines'],
  dataPres: [
    { minQty: 1, maxQty: '*', fieldConditions: ['Interval'] },
    { minQty: 1, maxQty: 1, fieldConditions: ['Nominal'] },
  ],
  channel: ['Color', 'Direction', 'Position'],
  recRate: 'Recommended',
  toSpec: getChartSpec,
};

/* 订制一个图表需要的所有参数 */
export const multi_measure_line_chart: CustomChart = {
  /* 图表唯一 Id */
  chartType: 'multi_measure_line_chart',
  /* 图表知识 */
  chartKnowledge: ckb as ChartKnowledge,
  /** 图表中文名 */
  chineseName: '折线图',
};

export default multi_measure_line_chart;
