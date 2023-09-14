'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Grid, Skeleton, AspectRatio, Box, aspectRatioClasses } from '@/lib/mui';
import { useRequest } from 'ahooks';
import useAgentChat from '@/hooks/use-agent-chat';
import Completion from '@/components/chat/completion';
import { ChartData } from '@/types/chart';
import LineChart from '../chart/line-chart';
import BarChart from '../chart/bar-chart';
import TableChart from '../chart/table-chart';
import { apiInterceptors, getChatHistory, postChatModeParamsList } from '@/client/api';
import { ChatContext } from '@/app/chat-context';
import MuiLoading from '../common/loading';
import Header from './header';
import { useSearchParams } from 'next/navigation';

const ChartSkeleton = () => {
  return (
    <Card className="h-full w-full flex bg-transparent">
      <Skeleton animation="wave" variant="text" level="body2" />
      <Skeleton animation="wave" variant="text" level="body2" />
      <AspectRatio
        ratio="21/9"
        className="flex-1"
        sx={{
          [`& .${aspectRatioClasses.content}`]: {
            height: '100%',
          },
        }}
      >
        <Skeleton variant="overlay" className="h-full" />
      </AspectRatio>
    </Card>
  );
};

const ChatContainer = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<Array<ChartData>>();
  const { refreshDialogList, scene, chatId, model, setModel } = useContext(ChatContext);

  const { data: historyList = [], run: runHistoryList } = useRequest(
    async () => {
      setLoading(true);
      const [, res] = await apiInterceptors(getChatHistory(chatId));
      setLoading(false);
      // use last view model_name as default model name
      const lastView = (res || []).filter((i) => i.role === 'view').slice(-1)[0];
      lastView?.model_name && setModel(lastView.model_name);
      return res ?? [];
    },
    {
      ready: !!chatId,
      refreshDeps: [chatId],
    },
  );

  const { history, handleChatSubmit } = useAgentChat({
    queryAgentURL: `/v1/chat/completions`,
    queryBody: {
      conv_uid: chatId,
      chat_mode: scene || 'chat_normal',
      model_name: model,
    },
    initHistory: historyList,
  });

  const { data: paramsObj = {} } = useRequest(
    async () => {
      const [, res] = await apiInterceptors(postChatModeParamsList(scene as string));
      return res ?? {};
    },
    {
      ready: !!scene,
      refreshDeps: [chatId, scene],
    },
  );

  useEffect(() => {
    if (!history || history.length < 1) {
      return;
    }
    try {
      const contextTemp = history?.[history.length - 1]?.context as string;
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
      const chartCalc = chartsData?.filter((item) => item.chart_type === 'IndicatorValue');
      if (chartCalc.length > 0) {
        res.push({
          charts: chartCalc,
          type: 'IndicatorValue',
        });
      }
      let otherCharts = chartsData?.filter((item) => item.chart_type !== 'IndicatorValue');
      let otherLength = otherCharts.length;
      let curIndex = 0;
      // charts 数量 3～8个，暂定每行排序
      let chartLengthMap = [[0], [1], [2], [1, 2], [1, 3], [2, 1, 2], [2, 1, 3], [3, 1, 3], [3, 2, 3]];
      chartLengthMap[otherLength].forEach((item) => {
        if (item > 0) {
          const rowsItem = otherCharts.slice(curIndex, curIndex + item);
          curIndex = curIndex + item;
          res.push({
            charts: rowsItem,
          });
        }
      });
      return res;
    }
    return undefined;
  }, [chartsData]);

  return (
    <>
      <Header
        refreshHistory={runHistoryList}
        modelChange={(newModel: string) => {
          setModel(newModel);
        }}
      />
      <MuiLoading visible={loading} />
      <div className="px-4 flex flex-1 overflow-hidden">
        {chartsData && (
          <div className="w-3/4">
            <div className="flex flex-col gap-3 h-full">
              {chartRows?.map((chartRow, index) => (
                <div key={`chart_row_${index}`} className={`${chartRow?.type !== 'IndicatorValue' ? 'flex gap-3' : ''}`}>
                  {chartRow.charts.map((chart) => {
                    if (chart.chart_type === 'IndicatorValue') {
                      return (
                        <div key={chart.chart_uid} className="flex flex-row gap-3">
                          {chart.values.map((item) => (
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
                    } else if (chart.chart_type === 'LineChart') {
                      return <LineChart key={chart.chart_uid} chart={chart} />;
                    } else if (chart.chart_type === 'BarChart') {
                      return <BarChart key={chart.chart_uid} chart={chart} />;
                    } else if (chart.chart_type === 'Table') {
                      return <TableChart key={chart.chart_uid} chart={chart} />;
                    }
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
        {/** skeleton */}
        {!chartsData && scene === 'chat_dashboard' && (
          <div className="w-3/4 p-6">
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
          </div>
        )}
        {/** chat panel */}
        <div className={`${scene === 'chat_dashboard' ? 'w-1/3' : 'w-full'} flex flex-1 flex-col h-full`}>
          <Completion
            clearInitMessage={async () => {
              await refreshDialogList();
            }}
            messages={history}
            onSubmit={handleChatSubmit}
            paramsObj={paramsObj}
          />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
