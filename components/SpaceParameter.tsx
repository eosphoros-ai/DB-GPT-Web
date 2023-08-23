import React, { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { sendSpacePostRequest } from '@/utils/request'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { Popover, Tabs, message } from 'antd'
import { Button, Sheet, Modal, Box, Stack, Input, Textarea } from '@/lib/mui'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const SpaceParameter = ({ spaceName }: { spaceName: string }) => {
  const [isParameterModalShow, setIsParameterModalShow] =
    useState<boolean>(false)
  const [newSpaceArguments, setNewSpaceArguments] = useState<any>({})
  const { t } = useTranslation()

  const { data: spaceArguments } = useRequest(
    () => sendSpacePostRequest(`/knowledge/${spaceName}/arguments`),
    {
      onSuccess(result: any) {
        setNewSpaceArguments(result.data)
      }
    }
  )
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
              marginBottom: '20px'
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('topk')}
                <Popover
                  content={t(`the top k vectors based on similarity score`)}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.topk || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.topk = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
                  }}
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('recall_score')}
                <Popover
                  content={t(
                    `Set a threshold score for the retrieval of similar vectors`
                  )}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={
                    '' + spaceArguments?.data?.embedding?.recall_score || ''
                  }
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.recall_score = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
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
              marginBottom: '20px'
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('recall_type')}
                <Popover
                  content={t(`recall type`)}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={
                    spaceArguments?.data?.embedding?.recall_type || ''
                  }
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.recall_type = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
                  }}
                  disabled
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('model')}
                <Popover
                  content={t(
                    `A model used to create vector representations of text or other data`
                  )}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={spaceArguments?.data?.embedding?.model || ''}
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.model = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
                  }}
                  disabled
                  startDecorator={
                    <Image
                      src="/huggingface_logo.svg"
                      alt="huggingface logo"
                      width={20}
                      height={20}
                    ></Image>
                  }
                ></Input>
              </Box>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              marginTop: '20px',
              marginBottom: '20px'
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0',
                marginRight: '30px'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('chunk_size')}
                <Popover
                  content={t(`The size of the data chunks used in processing`)}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={
                    spaceArguments?.data?.embedding?.chunk_size || ''
                  }
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.chunk_size = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
                  }}
                ></Input>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                flex: '1 1 0'
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px'
                }}
              >
                {t('chunk_overlap')}
                <Popover
                  content={t(
                    `The amount of overlap between adjacent data chunks`
                  )}
                  trigger="hover"
                  style={{ marginLeft: '20px' }}
                >
                  <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                </Popover>
              </Box>
              <Box>
                <Input
                  defaultValue={
                    spaceArguments?.data?.embedding?.chunk_overlap || ''
                  }
                  onChange={(e: any) => {
                    newSpaceArguments.embedding.chunk_overlap = e.target.value
                    setNewSpaceArguments({ ...newSpaceArguments })
                  }}
                ></Input>
              </Box>
            </Box>
          </Stack>
        </Box>
      )
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
              display: 'none'
            }
          }}
        >
          <Box sx={{ marginBottom: '20px', marginTop: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px'
              }}
            >
              {t('scene')}
              <Popover
                content={t(
                  `A contextual parameter used to define the setting or environment in which the prompt is being used`
                )}
                trigger="hover"
                style={{ marginLeft: '20px' }}
              >
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Textarea
                defaultValue={spaceArguments?.data?.prompt?.scene || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.scene = e.target.value
                  setNewSpaceArguments({ ...newSpaceArguments })
                }}
              ></Textarea>
            </Box>
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px'
              }}
            >
              {t('template')}
              <Popover
                content={t(
                  `A pre-defined structure or format for the prompt, which can help ensure that the AI system generates responses that are consistent with the desired style or tone.`
                )}
                trigger="hover"
                style={{ marginLeft: '20px' }}
              >
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Textarea
                defaultValue={spaceArguments?.data?.prompt?.template || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.template = e.target.value
                  setNewSpaceArguments({ ...newSpaceArguments })
                }}
              ></Textarea>
            </Box>
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px'
              }}
            >
              {t('max_token')}
              <Popover
                content={t(
                  `The maximum number of tokens or words allowed in a prompt`
                )}
                trigger="hover"
                style={{ marginLeft: '20px' }}
              >
                <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
              </Popover>
            </Box>
            <Box>
              <Input
                defaultValue={spaceArguments?.data?.prompt?.max_token || ''}
                onChange={(e: any) => {
                  newSpaceArguments.prompt.max_token = e.target.value
                  setNewSpaceArguments({ ...newSpaceArguments })
                }}
              ></Input>
            </Box>
          </Box>
        </Box>
      )
    }
  ]
  return (
    <>
      <Button variant="outlined" onClick={() => setIsParameterModalShow(true)}>
        <MiscellaneousServicesIcon
          sx={{ marginRight: '6px', fontSize: '18px' }}
        />
        {t('Arguments')}
      </Button>
      <Modal
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          'z-index': 1000
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
            boxShadow: 'lg'
          }}
        >
          <Tabs defaultActiveKey="Embedding" items={items} />
          <Stack
            direction="row"
            justifyContent="flex-start"
            sx={{
              marginTop: '20px',
              marginBottom: '20px'
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                sendSpacePostRequest(`/knowledge/${spaceName}/argument/save`, {
                  argument: JSON.stringify(newSpaceArguments)
                }).then((res: any) => {
                  if (res.success) {
                    window.location.reload()
                    message.success('success')
                  } else {
                    message.error(res.err_msg || 'failed')
                  }
                })
              }}
            >
              {t('Submit')}
            </Button>
          </Stack>
        </Sheet>
      </Modal>
    </>
  )
}

export default SpaceParameter
