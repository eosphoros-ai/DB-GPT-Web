'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Card, Grid, Skeleton, AspectRatio, Box, aspectRatioClasses } from '@/lib/mui';
import { useRequest } from 'ahooks';
import useAgentChat from '@/hooks/use-agent-chat';
import Completion from '@/components/chat/completion';
import { ChartData } from '@/types/chart';
import { apiInterceptors, getChatHistory, postChatModeParamsList } from '@/client/api';
import { ChatContext } from '@/app/chat-context';
import MuiLoading from '../common/loading';
import Header from './header';
import Chart from '../chart';
import classNames from 'classnames';

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
        <Chart chartsData={chartsData} />
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
        <div
          className={classNames('flex flex-1 flex-col h-full px-8 w-full', {
            'w-1/3 pl-4 px-0 py-0': scene === 'chat_dashboard',
          })}
        >
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
