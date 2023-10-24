import { ChartData } from '@/types/chat';
import { Card, CardContent, Typography } from '@mui/joy';
import { useEffect, useRef } from 'react';
import { Chart } from '@berryv/g2-rect';

export default function LineChart({ chart }: { chart: ChartData }) {
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
                autoFit: true,
                type: 'view',
                data: chart.values,
                encode: {
                  x: 'name',
                  y: 'value',
                  color: 'type',
                  shape: 'smooth',
                },
                children: [
                  {
                    type: 'interval',
                    legend: {
                      position: 'bottom',
                    },
                  },
                  {
                    type: 'area',
                    legend: false,
                    style: {
                      fillOpacity: 0.15,
                    },
                  },
                ],
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
