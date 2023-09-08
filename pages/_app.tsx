import type { AppProps } from 'next/app';
import React, { useContext, useEffect, useRef } from 'react';
import LeftSide from '@/components/left-side';
import { CssVarsProvider, ThemeProvider, useColorScheme } from '@mui/joy/styles';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/top-progress-bar';
import { useTranslation } from 'react-i18next';
import { ChatContext, ChatContextProvider } from '@/app/chat-context';
import classNames from 'classnames';
import '../styles/globals.css';
import '../nprogress.css';
import './i18n';

function CssWrapper({ children }: { children: React.ReactElement }) {
  const { i18n } = useTranslation();
  const { mode } = useColorScheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref?.current && mode) {
      ref?.current?.classList?.add(mode);
      if (mode === 'light') {
        ref?.current?.classList?.remove('dark');
      } else {
        ref?.current?.classList?.remove('light');
      }
    }
  }, [ref, mode]);
  useEffect(() => {
    i18n.changeLanguage && i18n.changeLanguage(window.localStorage.getItem('db_gpt_lng') || 'en');
  }, [i18n]);

  return (
    <div ref={ref} className="h-full">
      <TopProgressBar />
      <ChatContextProvider>{children}</ChatContextProvider>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isContract, isMenuExpand } = useContext(ChatContext);

  return (
    <>
      <div
        className={classNames(
          'grid h-full w-full grid-cols-1 grid-rows-[auto,1fr] text-smd dark:text-gray-300 md:grid-rows-[1fr] transition-width duration-500',
          {
            'md:grid-cols-[280px,1fr]': isMenuExpand,
            'md:grid-cols-[60px,1fr]': !isMenuExpand,
          },
        )}
      >
        <LeftSide />
        <div
          className={classNames('flex flex-col flex-1 relative overflow-hidden px-3', {
            'w-[calc(100vw - 76px)]': isContract,
          })}
        >
          {children}
        </div>
      </div>
    </>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={joyTheme}>
      <CssVarsProvider theme={joyTheme} defaultMode="light">
        <CssWrapper>
          <div className={`contents h-full`}>
            <LayoutWrapper>
              <Component {...pageProps} />
            </LayoutWrapper>
          </div>
        </CssWrapper>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
