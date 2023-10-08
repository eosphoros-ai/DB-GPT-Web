import React, { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { sendSpacePostRequest } from '@/utils/request';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { Popover, Tabs, message } from 'antd';
import { Button, Sheet, Modal, Box, Stack, Input, Textarea } from '@/lib/mui';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const SpaceParameterModal = ({ spaceName, isParameterModalShow, setIsParameterModalShow }: any) => {
  const [newSpaceArguments, setNewSpaceArguments] = useState<any>({});
  const { t } = useTranslation();

  const { data: spaceArguments } = useRequest(() => sendSpacePostRequest(`/knowledge/${spaceName.name}/arguments`), {
    onSuccess(result: any) {
      setNewSpaceArguments(result.data);
    },
  });

  const items = [
    {
      key: 'Embedding',
      label: (
        <Box>
          <ManageSearchIcon sx={{ marginRight: '5px' }} />
          {t('Embedding')}
        </Box>
      ),
      children: (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('topk')}
                <Popover content={t(`the_top_k_vectors`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.topk || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.topk = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('recall_score')}
                <Popover content={t(`Set_a_threshold_score`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={'' + spaceArguments?.data?.embedding?.recall_score || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.recall_score = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                  disabled
                ></Input>
              </Box>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('recall_type')}
                <Popover content={t(`Recall_Type`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.recall_type || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.recall_type = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                  disabled
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('model')}
                <Popover content={t(`A_model_used`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.model || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.model = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                  disabled
                  startDecorator={<Image src="/huggingface_logo.svg" alt="huggingface logo" width={20} height={20}></Image>}
                ></Input>
              </Box>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('chunk_size')}
                <Popover content={t(`The_size_of_the_data_chunks`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.chunk_size || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.chunk_size = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                }}
              >
                {t('chunk_overlap')}
                <Popover content={t(`The_amount_of_overlap`)} trigger="hover" style={{ marginLeft: '20px' }}>
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.chunk_overlap || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.chunk_overlap = e.target.value;
                    setNewSpaceArguments({ ...newSpaceArguments });
                  }}
                ></Input>
              </Box>
            </Box>
          </Stack>
        </Box>
      ),
    },
    {
      key: 'Prompt',
      label: (
        <Box>
          <TipsAndUpdatesIcon sx={{ marginRight: '5px' }} />
          {t('Prompt')}
        </Box>
      ),
      children: (
        <Box
          sx={{
            maxHeight: '600px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box sx={{ marginBottom: '20px', marginTop: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px',
              }}
            >
              {t('scene')}
              <Popover content={t(`A_contextual_parameter`)} trigger="hover" style={{ marginLeft: '20px' }}>
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Textarea
                defaultValue={spaceArguments?.data?.prompt?.scene || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.scene = e.target.value;
                  setNewSpaceArguments({ ...newSpaceArguments });
                }}
              ></Textarea>
            </Box>
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px',
              }}
            >
              {t('template')}
              <Popover content={t(`structure_or_format`)} trigger="hover" style={{ marginLeft: '20px' }}>
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Textarea
                defaultValue={spaceArguments?.data?.prompt?.template || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.template = e.target.value;
                  setNewSpaceArguments({ ...newSpaceArguments });
                }}
              ></Textarea>
            </Box>
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px',
              }}
            >
              {t('max_token')}
              <Popover content={t(`The_maximum_number_of_tokens`)} trigger="hover" style={{ marginLeft: '20px' }}>
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Input
                defaultValue={spaceArguments?.data?.prompt?.max_token || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.max_token = e.target.value;
                  setNewSpaceArguments({ ...newSpaceArguments });
                }}
              ></Input>
            </Box>
          </Box>
        </Box>
      ),
    },
  ];
  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        'z-index': 1000,
      }}
      open={isParameterModalShow}
      onClose={() => setIsParameterModalShow(false)}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 800,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <Tabs defaultActiveKey="Embedding" items={items} />
        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <Button
            variant="outlined"
            className="mr-3"
            onClick={() => {
              sendSpacePostRequest(`/knowledge/${spaceName.name}/argument/save`, {
                argument: JSON.stringify(newSpaceArguments),
              }).then((res: any) => {
                if (res.success) {
                  window.location.reload();
                  message.success('success');
                } else {
                  message.error(res.err_msg || 'failed');
                }
              });
            }}
          >
            {t('Submit')}
          </Button>
          <Button
            variant="outlined"
            color="danger"
            onClick={() => {
              setIsParameterModalShow(false);
            }}
          >
            关闭
          </Button>
        </Stack>
      </Sheet>
    </Modal>
  );
};

export default SpaceParameterModal;
