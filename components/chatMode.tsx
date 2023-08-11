"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, LineAdvance, Interval, Tooltip, getTheme } from "bizcharts";
import { Card, CardContent, Typography, Grid, Table, Skeleton, AspectRatio, Box, aspectRatioClasses } from "@/lib/mui";
import { useRequest } from 'ahooks';
import { sendGetRequest, sendPostRequest } from '@/utils/request';
import useAgentChat from '@/hooks/useAgentChat';
import ChatBoxComp from '@/components/chatBoxTemp';
import { useDialogueContext } from '@/app/context/dialogue';
import { useSearchParams } from 'next/navigation';
import lodash from 'lodash';

const ChartSkeleton = () => {
	return (
		<Card className="h-full w-full flex bg-transparent">
			<Skeleton
				animation="wave"
				variant="text"
				level="body2"
			/>
			<Skeleton
				animation="wave"
				variant="text"
				level="body2"
			/>
			<AspectRatio 
				ratio="21/9"
				className="flex-1"
				sx={{
					[`& .${aspectRatioClasses.content}`]: {
						height: '100%'
					}
				}}
			>
				<Skeleton variant="overlay" className="h-full" />
			</AspectRatio>
		</Card>
	)
};

const ChatMode = () => {
	const [chartsData, setChartsData] = useState();
	const searchParams = useSearchParams();
	const { refreshDialogList } = useDialogueContext();
	const id = searchParams.get('id');
	const scene = searchParams.get('scene');
	const { data: historyList, run: runHistoryList } = useRequest(async () => await sendGetRequest('/v1/chat/dialogue/messages/history', {
		con_uid: id
	}), {
		ready: !!id,
		refreshDeps: [id, scene]
	});
	
	const { data: dbList, run: runDbList } = useRequest(async () => await sendGetRequest('/v1/chat/db/list'), {
		ready: !!scene && !!['chat_with_db_execute', 'chat_with_db_qa'].includes(scene)
	});

	const { data: supportTypes } = useRequest(async () => await sendGetRequest('/v1/chat/db/support/type'), {
		ready: !!scene && !!['chat_with_db_execute', 'chat_with_db_qa'].includes(scene)
	});

	const { data: paramsList, run: runParamsList } = useRequest(async () => await sendPostRequest(`/v1/chat/mode/params/list?chat_mode=${scene}`), {
		ready: !!scene,
		refreshDeps: [id, scene]
	});

	const { history, handleChatSubmit } = useAgentChat({
		queryAgentURL: `/v1/chat/completions`,
		queryBody: {
			conv_uid: id,
			chat_mode: scene || 'chat_normal',
		},
		initHistory: historyList?.data,
		runHistoryList
	});

	useEffect(() => {
		try {
			const contextTemp = history?.[history.length - 1]?.context;
			const contextObj = JSON.parse(contextTemp);
			setChartsData(contextObj?.template_name === 'report' ? contextObj?.charts : undefined);
		} catch (e) {
			setChartsData(undefined);
		}
	}, [history]);

	const chartRows = useMemo(() => {
		if (chartsData) {
			let res = [];
			// 若是有类型为 IndicatorValue 的，提出去，独占一行
			const chartCalc = chartsData?.filter(
				(item) => item.chart_type === "IndicatorValue"
			);
			if (chartCalc.length > 0) {
				res.push({
					rowIndex: res.length,
					cols: chartCalc,
					type: "IndicatorValue",
				});
			}
			let otherCharts = chartsData?.filter(
				(item) => item.chart_type !== "IndicatorValue"
			);
			let otherLength = otherCharts.length;
			let curIndex = 0;
			// charts 数量 3～8个，暂定每行排序
			let chartLengthMap = [
				[0],
				[1],
				[2],
				[1, 2],
				[1, 3],
				[2, 1, 2],
				[2, 1, 3],
				[3, 1, 3],
				[3, 2, 3],
			];
			let currentRowsSort = chartLengthMap[otherLength];
			currentRowsSort.forEach((item) => {
				if (item > 0) {
					const rowsItem = otherCharts.slice(curIndex, curIndex + item);
					curIndex = curIndex + item;
					res.push({
						rowIndex: res.length,
						cols: rowsItem,
					});
				}
			});
			return res;
		}
		return undefined;
	}, [chartsData]);

	return (
		<Grid container spacing={2} className="h-full overflow-auto px-3" sx={{ flexGrow: 1 }}>
			{chartsData && (
				<Grid xs={8} className="max-h-full">
					<div className="flex flex-col gap-3 h-full">
						{chartRows?.map((chartRow) => (
							<div
								key={chartRow.rowIndex}
								className={`${
									chartRow?.type !== "IndicatorValue"
										? "flex flex-1 gap-3 overflow-hidden"
										: ""
								}`}
							>
								{chartRow.cols.map((col) => {
									if (col.chart_type === "IndicatorValue") {
										return (
											<div
												key={col.chart_uid}
												className="flex flex-row gap-3"
											>
												{col.values.map((item) => (
													<div key={item.name} className="flex-1">
														<Card sx={{ background: 'transparent' }}>
															<CardContent className="justify-around">
																<Typography gutterBottom component="div">
																	{item.name}
																</Typography>
																<Typography>{item.value}</Typography>
															</CardContent>
														</Card>
													</div>
												))}
											</div>
										);
									} else if (col.chart_type === "LineChart") {
										return (
											<div className="flex-1 overflow-hidden" key={col.chart_uid}>
												<Card className="h-full" sx={{ background: 'transparent' }}>
													<CardContent className="h-full">
														<Typography gutterBottom component="div">
															{col.chart_name}
														</Typography>
														<Typography gutterBottom level="body3">
															{col.chart_desc}
														</Typography>
														<div className="flex-1 h-full">
															<Chart
																autoFit
																data={col.values}
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
									} else if (col.chart_type === "BarChart") {
										return (
											<div className="flex-1" key={col.chart_uid}>
												<Card className="h-full" sx={{ background: 'transparent' }}>
													<CardContent className="h-full">
														<Typography gutterBottom component="div">
															{col.chart_name}
														</Typography>
														<Typography gutterBottom level="body3">
															{col.chart_desc}
														</Typography>
														<div className="flex-1">
															<Chart autoFit data={col.values}>
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
									} else if (col.chart_type === 'Table') {
										const data = lodash.groupBy(col.values, 'type');
										return (
											<div className="flex-1" key={col.chart_uid}>
												<Card className="h-full overflow-auto" sx={{ background: 'transparent' }}>
													<CardContent className="h-full">
														<Typography gutterBottom component="div">
															{col.chart_name}
														</Typography>
														<Typography gutterBottom level="body3">
															{col.chart_desc}
														</Typography>
														<div className="flex-1">
															<Table
																aria-label="basic table" 
																stripe="odd"
																hoverRow
																borderAxis="bothBetween"
															>
																<thead>
																	<tr>
																		{Object.keys(data).map(key => (
																			<th key={key}>{key}</th>
																		))}
																	</tr>
																</thead>
																<tbody>
																	{Object.values(data)?.[0]?.map((value, i) => (
																		<tr key={i}>
																			{Object.keys(data)?.map(k => (
																				<td key={k}>{data?.[k]?.[i].value || ''}</td>
																			))}
																		</tr>
																	))}
																</tbody>
															</Table>
														</div>
													</CardContent>
												</Card>
											</div>
										)
									}
								})}
							</div>
						))}
					</div>
				</Grid>
			)}
			{!chartsData && scene === 'chat_dashboard' && (
				<Grid xs={8} className="max-h-full p-6">
					<div className="flex flex-col gap-3 h-full">
						<Grid container spacing={2} sx={{ flexGrow: 1 }}>
							<Grid xs={8}>
							<Box className="h-full w-full" sx={{ display: 'flex', gap: 2 }}>
								<ChartSkeleton />
							</Box>
							</Grid>
							<Grid xs={4}>
								<ChartSkeleton />
							</Grid>
							<Grid xs={4}>
								<ChartSkeleton />
							</Grid>
							<Grid xs={8}>
								<ChartSkeleton />
							</Grid>
						</Grid>
					</div>
				</Grid>
			)}
			<Grid xs={scene === 'chat_dashboard' ? 4 : 12} className="h-full max-h-full">
				<div className='h-full' style={{ boxShadow: scene === 'chat_dashboard' ? '0px 0px 9px 0px #c1c0c080' : 'unset' }}>
					<ChatBoxComp
						clearIntialMessage={async () => {
							await refreshDialogList();
						}}
						dbList={dbList?.data}
						runDbList={runDbList}
						supportTypes={supportTypes?.data}
						messages={history || []}
						onSubmit={handleChatSubmit}
						paramsList={paramsList?.data}
						runParamsList={runParamsList}
						setChartsData={setChartsData}
					/>
				</div>
			</Grid>
		</Grid>
	)
}

export default ChatMode;