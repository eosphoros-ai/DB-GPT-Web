import { ChartData } from "@/types/chart";
import { Card, CardContent, Typography } from "@mui/joy";
import { Chart, LineAdvance } from "bizcharts";

export default function LineChart({ key, chart } : {
  key: string
  chart: ChartData
}) {
  return (
    <div className="flex-1" key={key}>
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
              autoFit
              data={chart.values}
            >
              <LineAdvance
                shape="smooth"
                point
                area
                position="name*value"
                color="type"
              />
            </Chart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
