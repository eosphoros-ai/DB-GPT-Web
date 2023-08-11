"use client"
import './globals.css'
import '@/nprogress.css';
import React from 'react';
import LeftSider from '@/components/leftSider';
import { CssVarsProvider, ThemeProvider } from '@mui/joy/styles';
import { useColorScheme } from '@/lib/mui';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/topProgressBar';
import DialogueContext, { useDialogueContext } from './context/dialogue';
import { useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MyDrawer from '@/components/myDrawer';
import WrapTextOutlinedIcon from '@mui/icons-material/WrapTextOutlined';

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
  const { isContract, setIsContract } = useDialogueContext();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      {isContract ? (
        <div className="grid h-full w-screen grid-rows-1 grid-cols-[auto,1fr] overflow-hidden text-smd dark:text-gray-300 md:grid-rows-[60px,1fr] md:grid-cols-[1fr]">
          <div className='border-[var(--joy-palette-divider)] bg-[#282828] text-[#f4f4f4] border-b border-solid flex items-center px-3 justify-between'>
            <MenuIcon className='cursor-pointer' onClick={() => { setOpen(true) }} />
            <div className='flex items-center cursor-pointer' onClick={() => { setIsContract(!isContract); }}>
              <WrapTextOutlinedIcon style={{ marginRight: '4px' }} />Change Mode
            </div>
          </div>
          <div className='relative min-h-0 min-w-0'>
            {children}
          </div>
        </div>
      ) : (
        <div className="grid h-full w-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden text-smd dark:text-gray-300 md:grid-cols-[280px,1fr] md:grid-rows-[1fr]">
          <LeftSider />
          <div className='relative min-h-0 min-w-0'>
            {children}
          </div>
        </div>
      )}
      <MyDrawer
        title="DB-GPT"
        position="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <LeftSider />
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