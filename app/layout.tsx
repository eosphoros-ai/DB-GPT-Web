"use client"
import './globals.css'
import '@/nprogress.css';
import React from 'react';
import LeftSide from '@/components/leftSide';
import { CssVarsProvider, ThemeProvider } from '@mui/joy/styles';
import { useColorScheme } from '@/lib/mui';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/topProgressBar';
import DialogueContext, { useDialogueContext } from './context/dialogue';
import { useEffect } from 'react';
import MyDrawer from '@/components/myDrawer';

function CssWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { mode } = useColorScheme();
  const ref = React.useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className='h-full'>
      <TopProgressBar />
      <DialogueContext>
        {children}
      </DialogueContext>
    </div>
  )
}

function LayoutWarpper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isContract } = useDialogueContext();
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <div className="grid h-full w-screen grid-cols-1 grid-rows-[auto,1fr] text-smd dark:text-gray-300 md:grid-cols-[280px,1fr] md:grid-rows-[1fr]">
        {!isContract && <LeftSide />}
        <div className='relative min-h-0 w-screen'>
          {children}
        </div>
      </div>
      <MyDrawer
        title="DB-GPT"
        position="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <LeftSide />
      </MyDrawer>
    </>
  )
}

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className="h-full font-sans">
      <body className={`h-full font-sans`}>
        <ThemeProvider theme={joyTheme}>
          <CssVarsProvider theme={joyTheme} defaultMode="light">
            <CssWrapper>
              <div className={`contents h-full`}>
                <LayoutWarpper>
                  {children}
                </LayoutWarpper>
              </div>
            </CssWrapper>
          </CssVarsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout;