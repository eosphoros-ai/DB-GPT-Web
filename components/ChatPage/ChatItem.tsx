import { Fragment } from 'react';
import { Link, Table } from '@/lib/mui';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  isChartChat?: boolean;
  isRobbort?: boolean;
  context: Record<string, any> | string;
  onLinkClick: () => void;
}

const options: MarkdownToJSX.Options = {
  overrides: {
    code: ({ children }) => (
      <SyntaxHighlighter language="javascript" style={okaidia}>
        {children}
      </SyntaxHighlighter>
    ),
    table: {
      props: {
        className:
          'my-2 border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm overflow-auto',
      },
    },
    thead: {
      props: {
        className: 'bg-slate-50 dark:bg-slate-700',
      },
    },
    th: {
      props: {
        className: 'w-1/2 border border-slate-300 dark:border-slate-600 font-semibold !p-4 text-slate-900 dark:text-slate-200 !text-left',
      },
    },
    td: {
      props: {
        className: 'border border-slate-300 dark:border-slate-700 !p-4 text-slate-500 dark:text-slate-400 !text-left',
      },
    },
  },
  wrapper: Fragment,
};

function ChatItem({ context, isChartChat, isRobbort, onLinkClick }: Props) {
  return (
    <div className={`${isRobbort ? 'bg-slate-100' : 'bg-white'}`}>
      <div className="py-8 px-4 flex items-start mx-auto leading-7 w-full lg:w-4/5 xl:3/4">
        <div className="flex items-center h-7 mr-4">{isRobbort ? <RobotOutlined /> : <UserOutlined />}</div>
        <div className="text-md font-normal text-gray-900">
          {isChartChat && typeof context === 'object' && (
            <>
              {`[${context.template_name}]: `}
              <Link
                sx={{
                  color: '#1677ff',
                }}
                component="button"
                onClick={onLinkClick}
              >
                {context.template_introduce || 'More Details'}
              </Link>
            </>
          )}
          {typeof context === 'string' && <Markdown options={options}>{context}</Markdown>}
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
