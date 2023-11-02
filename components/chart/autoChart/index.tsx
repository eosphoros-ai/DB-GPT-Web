import { Advice, Advisor } from '@antv/ava';
import { Chart } from '@berryv/g2-react';
import { customizeAdvisor, getVisAdvices } from './advisor/pipeline';
import { useEffect, useMemo, useState } from 'react';
import { defaultAdvicesFilter } from './advisor/utils';
import { AutoChartProps, ChartType, CustomAdvisorConfig, CustomChart, Specification } from './types';
import { defaultCharts } from './charts';
import { Empty } from 'antd';
import { VisToolbar } from './toolbar';

export const AutoChart = (props: AutoChartProps) => {
  const { data, chartType, scopeOfCharts, ruleConfig, customCharts } = props;

  const [advisor, setAdvisor] = useState<Advisor>();
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [renderChartType, setRenderChartType] = useState<ChartType>();

  useEffect(() => {
    const input_charts: CustomChart[] = defaultCharts;
    const allChartIds = [...input_charts.map((c) => c.chartType)];
    const advisorConfig: CustomAdvisorConfig = {
      charts: input_charts,
      scopeOfCharts: undefined,
      ruleConfig,
    };
    setAdvisor(customizeAdvisor(advisorConfig));
  }, [ruleConfig, scopeOfCharts, defaultCharts]);

  useEffect(() => {
    if (data && advisor) {
      const avaAdvices = getVisAdvices({
        data,
        myChartAdvisor: advisor,
      });
      const filteredAdvices = defaultAdvicesFilter({
        advices: avaAdvices,
      });
      setAdvices(filteredAdvices);

      const initType =
        filteredAdvices.find((item: Advice) => {
          return item.type === chartType;
        })?.type ?? filteredAdvices[0]?.type;
      setRenderChartType(initType as ChartType);
    }
  }, [data, advisor, chartType]);

  const visComponent = useMemo(() => {
    /* 如果存在有效建议，进入渲染流程 */
    if (advices?.length > 0) {
      const chartTypeInput = renderChartType ?? advices[0].type;
      const spec: Specification = advices?.find((item: Advice) => item.type === chartTypeInput)?.spec ?? undefined;
      if (spec) {
        return <Chart options={spec} />;
      }
    }
  }, [advices, data, renderChartType]);

  if (visComponent) {
    return (
      <div>
        <VisToolbar
          chartType={renderChartType}
          optionalChartTypes={advices?.map((item: Advice) => item.type)}
          onSelectChange={({ type, value }) => {
            setRenderChartType(value as ChartType);
          }}
          config={{ title: '自动推荐', chartSelector: true }}
        />
        <div className={`auto-chart-content`}> {visComponent}</div>
      </div>
    );
  }

  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无合适的可视化视图'} />;
};
