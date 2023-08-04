import React, { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { sendSpacePostRequest } from '@/utils/request'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Popover, message } from 'antd'
import {
  Button,
  Sheet,
  Modal,
  Box,
  Stack,
  Input,
  Textarea,
} from '@/lib/mui'

const SpaceParameter = ({ spaceName }: { spaceName: string }) => {
  const [isParameterModalShow, setIsParameterModalShow] =
    useState<boolean>(false)
  const [newSpaceArguments, setNewSpaceArguments] = useState<any>({})
  const [embeddingInfoIsFold, setEmbeddingInfoIsFold] = useState<boolean>(false)
  const [promptInfoIsFold, setPromptInfoIsFold] = useState<boolean>(false)

  const { data: spaceArguments } = useRequest(
    () => sendSpacePostRequest(`/knowledge/${spaceName}/arguments`),
    {
      onSuccess(result: any) {
        setNewSpaceArguments(result.data)
      }
    }
  )
  return (
    <>
      <Button variant="outlined" onClick={() => setIsParameterModalShow(true)}>
        Arguments
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
          <Box
            sx={{
              height: '500px',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <>
              <Box
                sx={{
                  fontWeight: 'bold',
                  fontSize: '25px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setEmbeddingInfoIsFold((cur) => !cur)
                }}
              >
                {embeddingInfoIsFold ? (
                  <ArrowRightIcon />
                ) : (
                  <ArrowDropDownIcon />
                )}
                embedding
              </Box>
              <Box
                sx={{
                  height: embeddingInfoIsFold ? '0px' : undefined,
                  overflow: 'hidden'
                }}
              >
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
                      flexGrow: '1',
                      flexShrink: '1',
                      marginRight: '30px'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      topk
                      <Popover
                        content={`the top k vectors based on similarity score`}
                        trigger="hover"
                        style={{ marginLeft: '20px' }}
                      >
                        <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                      </Popover>
                    </Box>
                    <Box>
                      <Input
                        defaultValue={
                          spaceArguments?.data?.embedding?.topk || ''
                        }
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
                      flexGrow: '1',
                      flexShrink: '1'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      recall_score
                      <Popover
                        content={`Set a threshold score for the retrieval of similar vectors`}
                        trigger="hover"
                        style={{ marginLeft: '20px' }}
                      >
                        <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                      </Popover>
                    </Box>
                    <Box>
                      <Input
                        defaultValue={
                          spaceArguments?.data?.embedding?.recall_score || ''
                        }
                        onChange={(e: any) => {
                          newSpaceArguments.embedding.recall_score =
                            e.target.value
                          setNewSpaceArguments({ ...newSpaceArguments })
                        }}
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
                      flexGrow: '1',
                      flexShrink: '1',
                      marginRight: '30px'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      recall_type
                      <Popover
                        content={`recall type`}
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
                          newSpaceArguments.embedding.recall_type =
                            e.target.value
                          setNewSpaceArguments({ ...newSpaceArguments })
                        }}
                      ></Input>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginBottom: '20px',
                      flexGrow: '1',
                      flexShrink: '1'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      model
                      <Popover
                        content={`A model used to create vector representations of text or other data`}
                        trigger="hover"
                        style={{ marginLeft: '20px' }}
                      >
                        <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                      </Popover>
                    </Box>
                    <Box>
                      <Input
                        defaultValue={
                          spaceArguments?.data?.embedding?.model || ''
                        }
                        onChange={(e: any) => {
                          newSpaceArguments.embedding.model = e.target.value
                          setNewSpaceArguments({ ...newSpaceArguments })
                        }}
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
                      flexGrow: '1',
                      flexShrink: '1',
                      marginRight: '30px'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      chunk_size
                      <Popover
                        content={`The size of the data chunks used in processing`}
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
                          newSpaceArguments.embedding.chunk_size =
                            e.target.value
                          setNewSpaceArguments({ ...newSpaceArguments })
                        }}
                      ></Input>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginBottom: '20px',
                      flexGrow: '1',
                      flexShrink: '1'
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: '10px'
                      }}
                    >
                      chunk_overlap
                      <Popover
                        content={`The amount of overlap between adjacent data chunks`}
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
                          newSpaceArguments.embedding.chunk_overlap =
                            e.target.value
                          setNewSpaceArguments({ ...newSpaceArguments })
                        }}
                      ></Input>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </>
            <>
              <Box
                sx={{
                  fontWeight: 'bold',
                  fontSize: '25px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setPromptInfoIsFold((cur) => !cur)
                }}
              >
                {promptInfoIsFold ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                prompt
              </Box>
              <Box
                sx={{
                  height: promptInfoIsFold ? '0px' : undefined,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ marginBottom: '20px' }}>
                  <Box
                    sx={{
                      marginBottom: '10px'
                    }}
                  >
                    scene
                    <Popover
                      content={`A contextual parameter used to define the setting or environment in which the prompt is being used`}
                      trigger="hover"
                      style={{ marginLeft: '20px' }}
                    >
                      <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                    </Popover>
                  </Box>
                  <Box>
                    <Textarea
                      minRows={5}
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
                    template
                    <Popover
                      content={`A pre-defined structure or format for the prompt, which can help ensure that the AI system generates responses that are consistent with the desired style or tone.`}
                      trigger="hover"
                      style={{ marginLeft: '20px' }}
                    >
                      <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                    </Popover>
                  </Box>
                  <Box>
                    <Textarea
                      minRows={5}
                      defaultValue={
                        spaceArguments?.data?.prompt?.template || ''
                      }
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
                    max_token
                    <Popover
                      content={`The maximum number of tokens or words allowed in a prompt`}
                      trigger="hover"
                      style={{ marginLeft: '20px' }}
                    >
                      <ErrorOutlineIcon sx={{ marginLeft: '10px' }} />
                    </Popover>
                  </Box>
                  <Box>
                    <Input
                      defaultValue={
                        spaceArguments?.data?.prompt?.max_token || ''
                      }
                      onChange={(e: any) => {
                        newSpaceArguments.prompt.max_token = e.target.value
                        setNewSpaceArguments({ ...newSpaceArguments })
                      }}
                    ></Input>
                  </Box>
                </Box>
              </Box>
            </>
          </Box>
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
              Submit
            </Button>
          </Stack>
        </Sheet>
      </Modal>
    </>
  )
}

export default SpaceParameter
