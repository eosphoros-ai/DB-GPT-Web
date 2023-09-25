import React, { useState, useRef, useCallback, useEffect } from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Button from '@mui/joy/Button';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import IconButton from '@mui/joy/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Slider from '@mui/joy/Slider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import { message, Tooltip } from 'antd';
import { useSearchParams } from 'next/navigation';
import { apiInterceptors, getChatFeedBackSelect, getChatFeedBackItme, postChatFeedBackForm } from '@/client/api';
import { ChatFeedBackSchema } from '@/types/db';

type Props = {
  conv_index: number;
  question: string|any;
  knowledge_space: string 
};

const ChatFeedback = ({ conv_index, question, knowledge_space }: Props) => {
  const searchParams = useSearchParams();
  const chatId = searchParams?.get('id') ?? '';
  const [ques_type, setQuesType] = useState('');
  const [score, setScore] = useState(4);
  const [text, setText] = useState('');
  const action = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [select_param, setSelectParam] = useState({});

  useEffect(() => {
    apiInterceptors(getChatFeedBackSelect()).then(res => {
      console.log(res);
      setSelectParam(res[1] ?? {});
    }).catch(err => {
      console.log(err);
    });
  }, []);

  const handleOpenChange = useCallback((event:any, isOpen:boolean) => {
    if (isOpen) {
      apiInterceptors(getChatFeedBackItme(chatId, conv_index))
        .then(res => {
          const finddata = res[1] ?? {};
          setQuesType(finddata.ques_type ?? '');
          setScore(parseInt(finddata.score ?? '4'));
          setText(finddata.messages ?? '');
        })
        .catch(err => {
          console.log(err);
        });
    }
    else {
      setQuesType('');
      setScore(4);
      setText('');
    }
  }, [chatId, conv_index]);

  const marks = [
    { value: 0, label: '0', },
    { value: 1, label: '1', },
    { value: 2, label: '2', },
    { value: 3, label: '3', },
    { value: 4, label: '4', },
    { value: 5, label: '5', },
  ];
  function valueText(value: number) {
    return {
      0: "渣渣",
      1: "没理解",
      2: "答不了",
      3: "答错了",
      4: "较啰嗦",
      5: "真棒"
    }[value];
  }
  const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#FBFCFD' : '#0E0E10',
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    height: '100%'
  }));
  const handleSubmit = (event:any) => {
    event.preventDefault();
    const formData : ChatFeedBackSchema = {
      conv_uid : chatId,
      conv_index : conv_index,
      question : question,
      knowledge_space : knowledge_space,
      score : score,
      ques_type : ques_type,
      messages : text
    };
    console.log(formData);
    apiInterceptors(postChatFeedBackForm({
      data: formData
    }))
      .then(res => {
        messageApi.open({ type: 'success', content: 'save success', });
      })
      .catch(err => {
        messageApi.open({ type: 'error', content: 'save error', });
      });
  };
  return (
    <Dropdown onOpenChange={handleOpenChange}>
      {contextHolder}
      <Tooltip title={'评分'}>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'primary' } }}
          sx={{ borderRadius: 40 }}
        >
          <MoreHorizIcon />
        </MenuButton>
      </Tooltip>
      <Menu>
        <MenuItem disabled sx={{ minHeight: 0 }} />
        <Box
          sx={{
            width: '100%',
            maxWidth: 350,
            display: 'grid',
            gap: 3,
            padding: 1,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={0.5} columns={13} sx={{ flexGrow: 1 }}>
              <Grid xs={3}>
                <Item>问答类别</Item>
              </Grid>
              <Grid xs={10}>
                <Select
                  action={action}
                  value={ques_type}
                  placeholder="Choose one…"
                  onChange={(event, newValue) => setQuesType(newValue ?? '')}
                  {...(ques_type && {
                    // display the button and remove select indicator
                    // when user has selected a value
                    endDecorator: (
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onMouseDown={(event) => {
                          // don't open the popup when clicking on this button
                          event.stopPropagation();
                        }}
                        onClick={() => {
                          setQuesType('');
                          action.current?.focusVisible();
                        }}
                      >
                        <CloseRounded />
                      </IconButton>
                    ),
                    indicator: null,
                  })}
                  sx={{ width: '100%' }} >
                  {Object.keys(select_param)?.map((paramItem) => (
                    <Option key={paramItem} value={paramItem}>
                      {select_param[paramItem]}
                    </Option>
                  ))}
                </Select>
              </Grid>
              <Grid xs={3}>
                <Item>
                  <Tooltip title={
                    <Box>
                      <div>
                        <p>0: 无结果</p>
                        <p>1: 有结果，但是在文不对题，没有理解问题</p>
                        <p>2: 有结果，理解了问题，但是提示回答不了这个问题</p>
                        <p>3: 有结果，理解了问题，并做出回答，但是回答的结果错误</p>
                        <p>4: 有结果，理解了问题，回答结果正确，但是比较啰嗦，缺乏总结</p>
                        <p>5: 有结果，理解了问题，回答结果正确，推理正确，并给出了总结，言简意赅</p>
                      </div>
                    </Box>
                  } variant="solid" placement="left">
                    回答评分
                  </Tooltip>
                </Item>
              </Grid>
              <Grid xs={10} sx={{ pl: 0, ml: 0 }}>
                <Slider
                  aria-label="Custom"
                  step={1}
                  min={0}
                  max={5}
                  valueLabelFormat={valueText}
                  valueLabelDisplay="on"
                  marks={marks}
                  sx={{ width: '90%', pt: 3, m: 2, ml: 1 }}
                  onChange={(event) => setScore(event.target?.value)}
                  value={score}
                />
              </Grid>
              <Grid xs={13}>
                <Textarea
                  placeholder="请输入详细信息..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  minRows={2}
                  maxRows={4}
                  endDecorator={
                    <Typography level="body-xs" sx={{ ml: 'auto' }}>
                      共计输入 {text.length} 字
                    </Typography>
                  }
                  sx={{ width: '100%', fontSize: 14 }}
                />
              </Grid>
              <Grid xs={13}>
                <Button type="submit" variant="outlined" sx={{ width: '100%', height: '100%' }}>提交</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Menu>
    </Dropdown>
  );
}
export default ChatFeedback;
