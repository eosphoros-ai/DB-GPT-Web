import { Fragment } from 'react';
import { Link } from '@/lib/mui';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface Props {
  isChartChat?: boolean;
  isRobbort?: boolean;
  context: Record<string, any> | string;
  onLinkClick: () => void;
}

const options: MarkdownToJSX.Options = {
  overrides: {
    code: ({ children, className }) => {
      return (
        <SyntaxHighlighter language="javascript" style={okaidia}>
          {children}
        </SyntaxHighlighter>
      );
    },
    img: {
      props: {
        className: 'my-2 !max-h-none',
      },
    },
    table: {
      props: {
        className: 'my-2 border-collapse border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm',
      },
    },
    thead: {
      props: {
        className: 'bg-slate-50 dark:bg-slate-700',
      },
    },
    th: {
      props: {
        className:
          'border border-slate-300 dark:border-slate-600 font-semibold !p-2 text-slate-900 dark:text-slate-200 !text-left whitespace-pre-wrap',
      },
    },
    td: {
      props: {
        className: 'border border-slate-300 dark:border-slate-700 !p-2 text-slate-500 dark:text-slate-400 !text-left whitespace-pre-wrap',
      },
    },
  },
  wrapper: Fragment,
  namedCodesToUnicode: {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '“',
  },
};

function ChatItem({ context, isChartChat, isRobbort, onLinkClick }: Props) {
  return (
    <div
      className={`overflow-x-auto w-full lg:w-4/5 xl:w-3/4 mx-auto flex px-2 py-2 sm:px-4 sm:py-6 rounded-xl ${
        isRobbort ? 'bg-slate-100 dark:bg-[#353539]' : ''
      }`}
    >
      <div className="mr-2 flex items-center justify-center h-7 w-7 rounded-full text-lg sm:mr-4">
        {isRobbort ? <RobotOutlined /> : <UserOutlined />}
      </div>
      <div className="flex-1 items-center text-md leading-7">
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
        {typeof context === 'string' && <Markdown options={options}>{context.replaceAll('\\n', '\n')}</Markdown>}
      </div>
    </div>
  );
}

export default ChatItem;
