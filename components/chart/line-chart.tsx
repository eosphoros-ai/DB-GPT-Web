import { ChartData } from '@/types/chart';
import { Card, CardContent, Typography } from '@mui/joy';
import { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';

export default function LineChart({ chart }: { chart: ChartData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const lineChart = new Line(chartRef.current, {
        data: chart.values,
        xField: 'name',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        // 配置折线趋势填充
        area: {
          style: {
            fillOpacity: 0.15,
          },
        },
        legend: {
          position: 'bottom',
        },
        animation: {
          appear: {
            animation: 'wave-in',
            duration: 3000,
          },
        },
      });
      lineChart.render();
    }
  }, [chart.values]);

  return (
    <div className="flex-1 min-w-0">
      <Card className="h-full" sx={{ background: 'transparent' }}>
        <CardContent className="h-full">
          <Typography gutterBottom component="div">
            {chart.chart_name}
          </Typography>
          <Typography gutterBottom level="body3">
            {chart.chart_desc}
          </Typography>
          <div className="h-[300px]" ref={chartRef}></div>
        </CardContent>
      </Card>
    </div>
  );
}
