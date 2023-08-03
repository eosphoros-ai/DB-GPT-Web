import { zodResolver } from '@hookform/resolvers/zod';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { 
  Card, 
  CircularProgress, 
  IconButton, 
  Input, 
  Stack, 
  Select,
  Option, 
  Box, 
  Modal, 
  ModalDialog, 
  ModalClose, 
  Button, 
  Link, 
  Table,
  buttonClasses
} from '@/lib/mui';
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Message } from '@/types';
import FaceRetouchingNaturalOutlinedIcon from '@mui/icons-material/FaceRetouchingNaturalOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Markdown from 'markdown-to-jsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSearchParams } from 'next/navigation';
import lodash from 'lodash';
import { message, Tooltip } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

type Props = {
  messages: Message[];
  onSubmit: (message: string, otherQueryBody?: any) => Promise<any>;
  readOnly?: boolean;
  paramsList?: { [key: string]: string };
  runParamsList: () => void;
  dbList?: Record<string, string | undefined | null | boolean>[];
  runDbList: () => void;
  supportTypes?: Record<string, string | undefined | null | boolean>[],
  clearIntialMessage?: () => void;
  setChartsData?: (chartsData: any) => void;
}; 

const Schema = z.object({ query: z.string().min(1) });

const ChatBoxComp = ({
  messages,
  onSubmit,
  readOnly,
  paramsList,
  runParamsList,
  dbList,
  runDbList,
  supportTypes,
  clearIntialMessage,
  setChartsData
}: Props) => {
  const searchParams = useSearchParams();
  const initMessage = searchParams.get('initMessage');
  const spaceNameOriginal = searchParams.get('spaceNameOriginal');
  const scene = searchParams.get('scene');
  const isChartChat = scene === 'chat_dashboard'
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentParam, setCurrentParam] = useState<string | undefined | null>();
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [currentJsonIndex, setCurrentJsonIndex] = useState<number>();
  const [showMessages, setShowMessages] = useState(messages);
  const [jsonValue, setJsonValue] = useState(''); 
  const [editSqlModalOpen, setEditSqlModalOpen] = useState(false);
  const [rows, setRows] = useState(dbList);

  const handleChangeRows = (index: number, name: string, value?: string | null) => {
    const temp = lodash.cloneDeep(rows);
    if (temp) {
      if (typeof rows?.[index] === 'undefined') {
        temp[index] = {};
      }
      temp[index][name] = value;
      setRows(temp);
    }
  };

  const methods = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {},
  });

  const submit = async ({ query }: z.infer<typeof Schema>) => {
    try {
      setIsLoading(true);
      methods.reset();
      await onSubmit(query, {
        select_param: paramsList?.[currentParam]
      });
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitMessage = async () => {
    try {
      const searchParamsTemp = new URLSearchParams(window.location.search);
      const initMessage = searchParamsTemp.get('initMessage');
      searchParamsTemp.delete('initMessage');
      window.history?.replaceState(null, null, `?${searchParamsTemp.toString()}`);
      await submit({ query: (initMessage as string) });
    } catch (err) {
      console.log(err);
    } finally {
      clearIntialMessage?.();
    }
  }

  const options = {
    overrides: {
      code: ({ children }) => (
        <SyntaxHighlighter language="javascript" style={okaidia}>
          {children}
        </SyntaxHighlighter>
      ),
    },
    wrapper: React.Fragment,
  };

  const handleJson2Obj = (jsonStr: string) => {
    let res = jsonStr;
    try {
      res = JSON.parse(jsonStr);
    } catch (e) {
      console.log(e);
    }
    return res;
  };

  const MyAceEditor = React.useMemo(() => {
    // fix npm run compile 'window is not defined' error
    if (typeof window !== 'undefined' && typeof window?.fetch === 'function') {
      const AceEditor = require('react-ace');
      require('ace-builds/src-noconflict/mode-json');
      require('ace-builds/src-noconflict/ext-language_tools');
      return AceEditor.default;
    }
    return undefined;
  }, []);

  React.useEffect(() => {
    if (!scrollableRef.current) {
      return;
    }
    scrollableRef.current.scrollTo(0, scrollableRef.current.scrollHeight);
  }, [messages?.length]);
  
  React.useEffect(() => {
    if (initMessage && messages.length <= 0) {
      handleInitMessage();
    }
  }, [initMessage, messages.length]);

  React.useEffect(() => {
    if (paramsList && Object.keys(paramsList || {})?.length > 0) {
      setCurrentParam(spaceNameOriginal || Object.keys(paramsList || {})?.[0]);
    }
  }, [paramsList]);

  React.useEffect(() => {
    if (isChartChat) {
      let temp = lodash.cloneDeep(messages);
      temp.forEach(item => {
        if (item?.role === 'view' && typeof item?.context === 'string') {
          item.context = handleJson2Obj(item?.context);
        }
      })
      setShowMessages(temp.filter(item => ['view', 'human'].includes(item.role)));
    } else {
      setShowMessages(messages.filter(item => ['view', 'human'].includes(item.role)));
    }
  }, [isChartChat, messages]);

  useEffect(() => {
    const temp = lodash.cloneDeep(dbList);
    temp?.forEach(item =>{
      const currentType = supportTypes?.find(type => type.db_type === item.db_type);
      item.isfileDb = currentType?.is_file_db;
    })
    setRows(temp);
  }, [dbList, supportTypes]);

  return (
    <div className='w-full h-full'>
      <Stack
        className="w-full h-full bg-[#fefefe] dark:bg-[#212121]"
        sx={{
          'table': {
            borderCollapse: 'collapse',
            border: '1px solid #ccc',
            width: '100%',
          },
          'th, td': {
            border: '1px solid #ccc',
            padding: '10px',
            textAlign: 'center'
          },
        }}
      >
        <Stack
          ref={scrollableRef}
          direction={'column'}
          sx={{
            overflowY: 'auto',
            maxHeight: '100%',
            flex: 1
          }}
        >
          {showMessages?.map((each, index) => {
            return (
              <Stack
                key={index}
              >
                <Card
                  size="sm"
                  variant={'outlined'}
                  color={each.role === 'view' ? 'primary' : 'neutral'}
                  sx={(theme) => ({
                    background: each.role === 'view' ? 'var(--joy-palette-primary-softBg, var(--joy-palette-primary-100, #DDF1FF))': 'unset',
                    border: 'unset',
                    borderRadius: 'unset',
                    padding: '24px 0 26px 0',
                    lineHeight: '24px',
                  })}
                >
                  <Box sx={{ width: '76%', margin: '0 auto' }} className="flex flex-row">
                    <div className='mr-3 inline'>
                      {each.role === 'view' ? (
                        <SmartToyOutlinedIcon />
                      ) : (
                        <FaceRetouchingNaturalOutlinedIcon />
                      )}
                    </div>
                    <div className='inline align-middle mt-0.5 max-w-full flex-1 overflow-auto'>
                      {
                        (isChartChat && each.role === 'view' && typeof each?.context === 'object') ? (
                          <>
                            {`[${each.context.template_name}]: `}
                            <Link
                              sx={{
                                color: '#1677ff'
                              }}
                              component="button"
                              onClick={() => {
                                setJsonModalOpen(true);
                                setCurrentJsonIndex(index);
                                setJsonValue(JSON.stringify(each?.context, null, 2)); 
                              }}
                            >
                              {each.context.template_introduce || '暂无介绍'}
                            </Link>
                          </>
                        ) : (
                          <>
                            {typeof each.context === 'string' && (
                              <Markdown options={options}>
                                {each.context?.replaceAll?.('\\n', '\n')}
                              </Markdown>
                            )}
                          </>
                        )
                      }
                    </div>
                  </Box>
                </Card>
              </Stack>
            )
          })}
          {isLoading && (
            <CircularProgress
              variant="soft"
              color="neutral"
              size="sm"
              sx={{ mx: 'auto', my: 2 }}
            />
          )}
        </Stack>
        {!readOnly && (
          <Box
            className="bg-[#fefefe] dark:bg-[#212121] before:bg-[#fefefe] before:dark:bg-[#212121]"
            sx={{
              position: 'relative',
              '&::before': {
                content: '" "',
                position: 'absolute',
                top: '-18px',
                left: '0',
                right: '0',
                width: '100%',
                margin: '0 auto',
                height: '20px',
                filter: 'blur(10px)',
                zIndex: 2,
              }
            }}
          >
            <form
              style={{
                maxWidth: '100%',
                width: '76%',
                position: 'relative',
                display: 'flex',
                marginTop: 'auto', 
                overflow: 'visible',
                background: 'none',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                flexDirection: 'column',
                gap: '12px',
                paddingBottom: '58px',
                paddingTop: '20px'
              }}
              onSubmit={(e) => {
                e.stopPropagation();
                methods.handleSubmit(submit)(e);
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                {(Object.keys(paramsList || {}).length > 0) && (
                  <div className='flex items-center gap-3'>
                    <Select
                      value={currentParam}
                      onChange={(e, newValue) => {
                        setCurrentParam(newValue);
                      }}
                      sx={{ maxWidth: '100%' }}
                    >
                      {Object.keys(paramsList || {})?.map(paramItem => (
                        <Option
                          key={paramItem}
                          value={paramItem}
                        >
                          {paramItem}
                        </Option>
                      ))}
                    </Select>
                    
                  </div>
                )}
                {['chat_with_db_execute', 'chat_with_db_qa'].includes(scene) && (
                  <Button
                    aria-label="Like"
                    variant="plain"
                    color="neutral"
                    sx={{
                      padding: 0,
                      '&: hover': {
                        backgroundColor: 'unset'
                      }
                    }}
                    onClick={() => { setEditSqlModalOpen(true) }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <SettingsSuggestIcon style={{ marginBottom: '0.125rem', fontSize: '28px' }}/>
                      <span style={{ display: 'block', lineHeight: '25px', fontSize: 12, marginLeft: 6 }}>DB Connect Setting</span>
                    </div>
                  </Button>
                )}
              </div>
              <Input
                className='w-full h-12'
                variant="outlined"
                endDecorator={
                  <IconButton type="submit" disabled={isLoading}>
                    <SendRoundedIcon />
                  </IconButton>
                }
                {...methods.register('query')}
              />
            </form>
          </Box>
        )}
      </Stack>
      <Modal
        open={jsonModalOpen}
        onClose={() => { setJsonModalOpen(false); } }
      >
        <ModalDialog
          aria-labelledby="variant-modal-title"
          aria-describedby="variant-modal-description"
        >
          <ModalClose />
          <Box sx={{ marginTop: '32px' }}>
            {!!MyAceEditor && (
              <MyAceEditor
                mode="json"
                value={jsonValue}
                height={'600px'}
                width={'820px'}
                onChange={setJsonValue}
                placeholder={'默认json数据'}
                debounceChangePeriod={100}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  highlightSelectedWord: true,
                  tabSize: 2,
                }}
              />
            )}
            
            <Button
              variant="outlined"
              className="w-full"
              sx={{
                marginTop: '12px'
              }}
              onClick={() => {
                if (currentJsonIndex) {
                  try {
                    const temp = lodash.cloneDeep(showMessages);
                    const jsonObj = JSON.parse(jsonValue);
                    temp[currentJsonIndex].context = jsonObj;
                    setShowMessages(temp);
                    setChartsData?.(jsonObj?.charts);
                    setJsonModalOpen(false);
                    setJsonValue('');
                  } catch (e) {
                    message.error('JSON 格式化出错');
                  }
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      <Modal
        open={editSqlModalOpen}
        onClose={() => { setEditSqlModalOpen(false); runParamsList?.(); }}
      >
        <ModalDialog>
          <ModalClose />
          <Table>
            <caption>
              <h3 style={{ fontWeight: 'bold' }}>数据库列表</h3>
            </caption>
            <thead>
              <tr>
                <th style={{ width: '140px' }}>数据库类型</th>
                <th style={{ width: '130px' }}>数据库名</th>
                <th style={{ width: '150px' }}>链接地址/域名</th>
                <th style={{ width: '100px' }}>端口</th>
                <th style={{ width: '140px' }}>用户名</th>
                <th style={{ width: '140px' }}>密码</th>
                <th style={{ width: '140px' }}>备注</th>
                <th style={{ width: '140px' }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    {row?.isEdit ? (
                      <Select
                        defaultValue={row?.db_type}
                        onChange={(e, newValue) => {
                          const isfileDb = supportTypes?.find(item => item.db_type === newValue);
                          const temp = lodash.cloneDeep(rows);
                          temp[rowIndex]['db_type'] = newValue;
                          temp[rowIndex]['isfileDb'] = isfileDb?.is_file_db;
                          if (isfileDb) {
                            temp[rowIndex]['db_host'] = '';
                            temp[rowIndex]['db_port'] = '';
                          } else {
                            temp[rowIndex]['db_path'] = '';
                          }
                          setRows(temp);
                        }}
                      >
                        {supportTypes?.map((type) => (
                          <Option
                            key={type.db_type}
                            value={type.db_type}
                          >
                            {type?.db_type}
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      <Tooltip title={row?.db_type}>{row?.db_type}</Tooltip>
                    )}
                  </td>
                  <td>
                    {row?.isNew ? (
                      <Input
                        value={row?.db_name}
                        onChange={(e) => { handleChangeRows(rowIndex, 'db_name', e.target.value) }}
                      />
                    ) : (
                      <Tooltip title={row?.db_name}>{row?.db_name}</Tooltip>
                    )}
                  </td>
                  <td>
                    {row?.isEdit ? (
                      <Input
                        value={row?.isfileDb ? row?.db_path : row?.db_host}
                        onChange={(e) => {
                          if (row?.isfileDb) {
                            handleChangeRows(rowIndex, 'db_path', e.target.value);
                          } else {
                            handleChangeRows(rowIndex, 'db_host', e.target.value);
                          }
                        }}
                      />
                    ) : (
                      <Tooltip title={row?.isfileDb ? row?.db_path : row?.db_host}>
                        {row?.isfileDb ? row?.db_path : row?.db_host}
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    {row?.isEdit ? (row?.isfileDb ? '-' :(
                      <Input
                        value={row?.db_port}
                        onChange={(e) => { handleChangeRows(rowIndex, 'db_port', e.target.value) }}
                      />
                    )) : (
                      <Tooltip title={row?.db_port}>{row?.db_port}</Tooltip>
                    )}
                  </td>
                  <td>
                    {row?.isEdit ? (
                      <Input
                        defaultValue={row.db_user}
                        onChange={(e) => { handleChangeRows(rowIndex, 'db_user', e.target.value) }}
                      />
                    ) : (
                      <Tooltip title={row?.db_user}>{row?.db_user}</Tooltip>
                    )}
                  </td>
                  <td>
                    {row?.isEdit ? (
                      <Input
                        defaultValue={row.db_pwd}
                        type="password"
                        onChange={(e) => { handleChangeRows(rowIndex, 'db_pwd', e.target.value) }}
                      />
                    ) : (
                      <>******</>
                    )}
                  </td>
                  <td>
                    {row?.isEdit ? (
                      <Input
                        defaultValue={row?.comment}
                        onChange={(e) => { handleChangeRows(rowIndex, 'comment', e.target.value) }}
                      />
                    ) : (
                      <Tooltip title={row?.comment}>{row?.comment}</Tooltip>
                    )}
                  </td>
                  <td>
                    <Box sx={{
                      gap: 1,
                      [`& .${buttonClasses.root}`]: {
                        padding: 0,
                        '&:hover': {
                          background: 'transparent',
                        }
                      }
                    }}>
                      {row?.isEdit ? (
                        <>
                          <Button
                            size="sm"
                            variant="plain"
                            color="neutral"
                            sx={{ marginRight: '8px' }}
                            onClick={async () => {
                              const temp = lodash.cloneDeep(row);
                              const params = {
                                db_type: temp?.db_type,
                                db_name: temp?.db_name,
                                file_path: temp?.isfileDb ? temp?.db_path : undefined,
                                db_host: temp?.isfileDb ? undefined : temp?.db_host,
                                db_port: temp?.isfileDb ? undefined : temp?.db_port,
                                db_user: temp?.db_user,
                                db_pwd: temp?.db_pwd,
                                comment: temp?.comment
                              };
                              let res;
                              if (temp.isNew) {
                                const names = dbList?.map(db => db?.db_name);
                                if (names?.includes(temp?.db_name)) {
                                  message.error('该数据库名称已存在');
                                  return;
                                } else {
                                  res = await sendSpacePostRequest('/api/v1/chat/db/add', params);
                                }
                              } else {
                                res = await sendSpacePostRequest('/api/v1/chat/db/edit', params);
                              }
                              await runDbList?.();
                            }}
                          >
                            保存
                          </Button>
                          <Button
                            size="sm"
                            variant="plain"
                            color="neutral"
                            sx={{ marginRight: '8px' }}
                            onClick={() => {
                              const temp = lodash.cloneDeep(rows);
                              if (row?.isNew) {
                                temp.splice(rowIndex, 1);
                              } else {
                                temp[rowIndex].isEdit = false;
                                temp[rowIndex] = dbList?.[rowIndex];
                              }
                              setRows(temp);
                            }}
                          >
                            取消
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="plain"
                          color="neutral"
                          sx={{ marginRight: '8px' }}
                          onClick={() => {
                            const temp = lodash.cloneDeep(rows);
                            temp[rowIndex].isEdit = true;
                            setRows(temp);
                          }}
                        >
                          编辑
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        onClick={async () => {
                          if (row?.db_name) {
                            await sendSpacePostRequest(`/api/v1/chat/db/delete?db_name=${row?.db_name}`);
                            await runDbList?.();
                          }
                        }}
                      >
                        删除
                      </Button>
                    </Box>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={8}>
                  <Button
                    variant='outlined'
                    sx={{ width: '100%' }}
                    onClick={() => {
                      const temp = lodash.cloneDeep(rows);
                      temp?.push({ isEdit: true, isNew: true, db_name: '' });
                      setRows(temp);
                    }}
                  >+ 新增一行</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default ChatBoxComp;
