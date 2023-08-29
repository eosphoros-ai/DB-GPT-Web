import { ChartData } from "@/types/chart";
import { Card, CardContent, Typography } from "@mui/joy";
import { Chart, Interval, Tooltip, getTheme } from "bizcharts";

export default function BarChart({ key, chart } : {
  key: string
  chart: ChartData
}) {
  return (
    <div className="flex-1 min-w-0" key={key}>
      <Card className="h-full" sx={{ background: 'transparent' }}>
        <CardContent className="h-full">
          <Typography gutterBottom component="div">
            {chart.chart_name}
          </Typography>
          <Typography gutterBottom level="body3">
            {chart.chart_desc}
          </Typography>
          <div className="h-[300px]">
            <Chart autoFit data={chart.values}>
              <Interval
                position="name*value"
                style={{
                  lineWidth: 3,
                  stroke: getTheme().colors10[0],
                }}
              />
              <Tooltip shared />
            </Chart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
