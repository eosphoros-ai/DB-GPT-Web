import type { AppProps } from 'next/app';
import React, { useContext, useEffect, useRef } from 'react';
import LeftSide from '@/components/layout/left-side';
import { CssVarsProvider, ThemeProvider, useColorScheme } from '@mui/joy/styles';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/layout/top-progress-bar';
import { useTranslation } from 'react-i18next';
import { ChatContext, ChatContextProvider } from '@/app/chat-context';
import classNames from 'classnames';
import '../styles/globals.css';
import '../nprogress.css';
import '../app/i18n';

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
    <div ref={ref}>
      <TopProgressBar />
      <ChatContextProvider>{children}</ChatContextProvider>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isMenuExpand } = useContext(ChatContext);

  return (
    <>
      <div className="flex w-screen h-screen overflow-hidden">
        <div className={classNames('transition-[width]', isMenuExpand ? 'w-[240px]' : 'w-[80px]', 'hidden', 'md:block')}>
          <LeftSide />
        </div>
        <div className="flex flex-col flex-1 relative overflow-hidden">{children}</div>
      </div>
    </>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={joyTheme}>
      <CssVarsProvider theme={joyTheme} defaultMode="light">
        <CssWrapper>
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        </CssWrapper>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
