import { Fragment, useContext } from 'react';
import { Link, Stack, Chip } from '@/lib/mui';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { renderModelIcon } from '@/components/chat/header/model-selector';
import { IChatDialogueMessageSchema } from '@/types/chart';
import classNames from 'classnames';
import { ChatContext } from '@/app/chat-context';

interface Props {
  content: IChatDialogueMessageSchema;
  isChartChat?: boolean;
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
        className: 'border border-slate-300 dark:border-slate-600 font-semibold !p-2 text-slate-900 dark:text-slate-200 !text-left',
      },
    },
    td: {
      props: {
        className: 'border border-slate-300 dark:border-slate-700 !p-2 text-slate-500 dark:text-slate-400 !text-left',
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

function formattext(params: any) {
  if (typeof params === 'string') {
    const chartList = ["_", "*", "`", "(", ")", "+", "-", ".", "!", "#", "[", "]", "{", "}"];
    let p = params;
    chartList.forEach((element) => {
      p = p.replaceAll(element, "\\" + element);
    });
    p = p.replaceAll("\n", "<br/>")
    p = p.replaceAll("\\n", "<br/>")
    return p;
  }
  else {
    return params;
  }
}

function ChatContent({ content, isChartChat, onLinkClick }: Props) {
  const { context, model_name, role } = content;
  const { scene } = useContext(ChatContext);
  const isRobot = role === 'view';

  const dataArray = typeof context === 'string' ? context.split("\trelations:") : [context];
  const context_msg = dataArray[0];
  const relation = ((dataArray.length > 1 && typeof dataArray[1] === 'string') ? dataArray[1] : null)?.split(",");
  return (
    <div
      className={classNames('overflow-x-auto w-full flex px-2 sm:px-4 py-2 sm:py-6 rounded-xl', {
        'bg-slate-100 dark:bg-[#353539]': isRobot,
        'lg:w-full xl:w-full pl-0': ['chat_with_db_execute', 'chat_dashboard'].includes(scene),
      })}
    >
      <div className="mr-2 flex flex-shrink-0 items-center justify-center h-7 w-7 rounded-full text-lg sm:mr-4">
        {isRobot ? renderModelIcon(model_name) || <RobotOutlined /> : <UserOutlined />}
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
        {typeof context === 'string' && <Markdown options={options}>{formattext(context_msg)}</Markdown>}
        {typeof relation === 'object' && relation?.length > 0 && (
          <Stack sx={{ mt: 1 }} direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {relation?.map(rr => (<Chip key={rr} sx={{ borderColor: '#4393E4' }} variant="outlined" size="sm">{rr}</Chip>))}
          </Stack>
        )}
      </div>
    </div>
  );
}

export default ChatContent;
