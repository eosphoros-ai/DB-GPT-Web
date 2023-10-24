import { ChartData } from '@/types/chat';
import { Chart } from '@berryv/g2-rect';
import { Card, CardContent, Typography } from '@mui/joy';

export default function BarChart({ chart }: { key: string; chart: ChartData }) {
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
          <div className="h-[300px]">
            <Chart
              options={{
                type: 'interval',
                autoFit: true,
                data: chart.values,
                encode: { x: 'name', y: 'value', color: 'type' },
                legend: {
                  position: 'bottom',
                },
                animation: {
                  appear: {
                    animation: 'wave-in',
                    duration: 3000,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
