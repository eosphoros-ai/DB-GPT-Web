import { ChartData } from '@/types/chart';
import { Column } from '@antv/g2plot';
import { Card, CardContent, Typography } from '@mui/joy';
import { useEffect, useRef } from 'react';

export default function BarChart({ chart }: { key: string; chart: ChartData }) {
  const ref = useRef(null);
  const chartInstanceRef = useRef<{ chart: Column | null }>({ chart: null });
  useEffect(() => {
    if (ref.current) {
      if (chartInstanceRef.current.chart) {
        chartInstanceRef.current.chart.destroy();
      }
      chartInstanceRef.current.chart = new Column(ref.current, {
        data: chart.values,
        xField: 'name',
        yField: 'value',
        seriesField: 'type',
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
      chartInstanceRef.current.chart.render();
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
          <div className="h-[300px]" ref={ref}></div>
        </CardContent>
      </Card>
    </div>
  );
}
