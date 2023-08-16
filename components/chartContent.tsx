import React from 'react';
import { Card, CardContent, Typography, Table } from "@/lib/mui";
import { Chart, LineAdvance, Interval, Tooltip, getTheme } from "bizcharts";
import { Empty } from 'antd';
import lodash from 'lodash';

interface IProps {
	type: string;
	values: any;
	title?: string;
	description?: string;
}

function ChartContent({
	type,
	values,
	title,
	description
}: IProps) {

	const chartContent = React.useMemo(() => {
		if (!(values?.length > 0)) {
			return (
				<div className='h-full'>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="图表数据为空" />
				</div>
			)
		}
		if (type === 'IndicatorValue') return;
		
		if (type === 'Table') {
			const data = lodash.groupBy(values, 'type');
			return (
				<div className="flex-1 overflow-auto">
					<Table
						aria-label="basic table" 
						hoverRow
						stickyHeader
					>
						<thead>
							<tr>
								{Object.keys(data).map(key => (
									<th key={key}>{key}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Object.values(data)?.[0]?.map?.((value, i) => (
								<tr key={i}>
									{Object.keys(data)?.map(k => (
										<td key={k}>{data?.[k]?.[i].value || ''}</td>
									))}
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)
		}
		if (type === 'BarChart') {
			return (
				<div className="flex-1 h-full">
					<Chart autoFit data={values || []} forceUpdate>
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
			)
		}
		if (type === 'LineChart') {	
			return (
				<div className="flex-1 h-full">
					<Chart
						forceUpdate
						autoFit
						data={values || []}
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
			)
		}

		return (
			<div className='h-full'>
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂不支持该图表类型" />
			</div>
		)
	}, [values, type]);

	if (type === 'IndicatorValue' && values?.length > 0) {
		return (
			<div
				className="flex flex-row gap-3"
			>
				{values.map((item: { name: string; type: string; value: string | number }) => (
					<div key={item.name} className="flex-1">
						<Card sx={{ background: 'transparent' }}>
							<CardContent className="justify-around">
								<Typography gutterBottom component="div">
									{item.name}
								</Typography>
								<Typography>{`${item.type}: ${item.value}`}</Typography>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="flex-1 h-full">
			<Card className="h-full overflow-auto" sx={{ background: 'transparent' }}>
				<CardContent className="h-full">
					{title && (
						<Typography gutterBottom component="div">
							{title}
						</Typography>
					)}
					{description && (
						<Typography gutterBottom level="body3">
							{description}
						</Typography>
					)}
					{chartContent}
				</CardContent>
			</Card>
		</div>
	);
}

export default ChartContent;