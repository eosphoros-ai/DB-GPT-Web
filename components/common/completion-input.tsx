import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { PropsWithChildren, useState } from 'react';
import PromptBot from './prompt-bot';
import SpaceUpload from '../chat/header/doc-upload';

type TextAreaProps = Omit<Parameters<typeof Input.TextArea>[0], 'value' | 'onPressEnter' | 'onChange' | 'onSubmit'>;

interface Props {
  loading?: boolean;
  onSubmit: (val: string) => void;
}

function CompletionInput({ children, loading, onSubmit, ...props }: PropsWithChildren<Props & TextAreaProps>) {
  const [userInput, setUserInput] = useState('');

  return (
    <>
      <SpaceUpload />
      <Input.TextArea
        className="flex-1"
        size="large"
        value={userInput}
        autoSize={{ minRows: 1, maxRows: 4 }}
        {...props}
        onPressEnter={(e) => {
          if (!userInput.trim()) return;
          if (e.keyCode === 13) {
            if (e.shiftKey) {
              setUserInput((state) => state + '\n');
              return;
            }
            onSubmit(userInput);
            setTimeout(() => {
              setUserInput('');
            }, 0);
          }
        }}
        onChange={(e) => {
          if (typeof props.maxLength === 'number') {
            setUserInput(e.target.value.substring(0, props.maxLength));
            return;
          }
          setUserInput(e.target.value);
        }}
      />
      <Button
        className="ml-2 flex items-center justify-center"
        size="large"
        type="text"
        loading={loading}
        icon={<SendOutlined />}
        onClick={() => {
          onSubmit(userInput);
        }}
      />
      <PromptBot
        submit={(prompt) => {
          setUserInput(userInput + prompt);
        }}
      />
      {children}
    </>
  );
}

export default CompletionInput;
