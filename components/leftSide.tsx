'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Modal } from 'antd';
import { Box, List, ListItem, ListItemButton, ListItemDecorator, ListItemContent, Typography, Button, useColorScheme, IconButton, Tooltip } from '@/lib/mui';
import Article from '@mui/icons-material/Article';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { useDialogueContext } from '@/app/context/dialogue';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { sendPostRequest } from '@/utils/request';
import Image from 'next/image'
import classNames from "classnames";
import MenuIcon from '@mui/icons-material/Menu';
import DatasetIcon from '@mui/icons-material/Dataset';
import ExpandIcon from '@mui/icons-material/Expand';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

interface Dialogue {
  conv_uid: string;
  user_input: string;
  user_name: string;
  chat_mode: string;
  select_param: string;
}

const LeftSide = () => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
	const id = searchParams.get('id');
	const router = useRouter();
	const [logoPath, setLogoPath] = useState('/LOGO_1.png');
	const { dialogueList, queryDialogueList, refreshDialogList, isMenuExpand, setIsMenuExpand } = useDialogueContext();
	const { mode, setMode } = useColorScheme();
  const menus = useMemo(() => {
    return [
      {
        label: t('Data Source'),
        route: '/database',
        icon: <DatasetIcon fontSize='small' />,
        tooltip: 'Database',
        active: pathname === '/database',
      },
      {
        label: t('Knowledge_Space'),
        route: '/datastores',
        icon: <Article fontSize="small" />,
        tooltip: 'Knowledge',
        active: pathname === '/datastores',
      }
    ];
  }, [pathname, i18n.language]);

  function handleChangeTheme() {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  }

  useEffect(() => {
    if (mode === 'light') {
      setLogoPath('/LOGO_1.png');
    } else {
      setLogoPath('/WHITE_LOGO.png');
    }
  }, [mode]);

  useEffect(() => {
    (async () => {
      await queryDialogueList();
    })();
  }, []);

  function expandMenu() {
    return (
      <>
        <Box className="p-2 gap-2 flex flex-row justify-between items-center">
          <div className='flex items-center gap-3'>
            <Image
              src={logoPath}
              alt="DB-GPT"
              width={633}
              height={157}
              className='w-full max-w-full'
              unoptimized
            />
          </div>
        </Box>
        <Box className="px-2">
          <Link href={`/`}>
            <Button
              color="primary"
              className='w-full bg-gradient-to-r from-[#31afff] to-[#1677ff] dark:bg-gradient-to-r dark:from-[#6a6a6a] dark:to-[#80868f]'
              style={{
                color: '#fff'
              }}
            >
              + New Chat
            </Button>
          </Link>
        </Box>
        <Box className="p-2 hidden xs:block sm:inline-block max-h-full overflow-auto">
          <List size="sm" sx={{ '--ListItem-radius': '8px' }}>
            <ListItem nested>
              <List
                size="sm"
                aria-labelledby="nav-list-browse"
                sx={{
                  '& .JoyListItemButton-root': { p: '8px' },
                  gap: '4px'
                }}
              >
                {dialogueList?.data?.map((dialogue: Dialogue) => {
                  const isSelect = (pathname === `/chat` || pathname === '/chat/') && id === dialogue.conv_uid;
                  return (
                    <ListItem key={dialogue.conv_uid}>
                      <ListItemButton
                        selected={isSelect}
                        variant={isSelect ? 'soft' : 'plain'}
                        sx={{
                          '&:hover .del-btn': {
                            visibility: 'visible'
                          }
                        }}
                      >
                        <ListItemContent>
                          <Link href={`/chat?id=${dialogue.conv_uid}&scene=${dialogue?.chat_mode}`} className="flex items-center justify-between" >
                            <Typography fontSize={14} noWrap={true}>
                              <SmsOutlinedIcon style={{ marginRight: '0.5rem' }} />
                              {dialogue?.user_name || dialogue?.user_input || 'undefined'}
                            </Typography>
                            <IconButton
                              color="neutral"
                              variant="plain"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                Modal.confirm({
                                  title: 'Delete Chat',
                                  content: 'Are you sure delete this chat?',
                                  width: '276px',
                                  centered: true,
                                  async onOk() {
                                    await sendPostRequest(`/v1/chat/dialogue/delete?con_uid=${dialogue.conv_uid}`);
                                    await refreshDialogList();
                                    if (pathname === `/chat` && searchParams.get('id') === dialogue.conv_uid) {
                                      router.push('/');
                                    }
                                  }
                                })
                              }}
                              className='del-btn invisible'
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Link>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            </ListItem>
          </List>
        </Box>
        <div className='flex flex-col justify-end flex-1'>
          <Box className="p-2 pt-3 pb-6 border-t border-divider xs:block sticky bottom-0 z-100">
            <List size="sm" sx={{ '--ListItem-radius': '8px' }}>
              <ListItem nested>
                <List
                  size="sm"
                  aria-labelledby="nav-list-browse"
                  sx={{
                    '& .JoyListItemButton-root': { p: '8px' },
                  }}
                >
                  {menus.map((menu) => (
                    <Link key={menu.route} href={menu.route}>
                      <ListItem>
                        <ListItemButton
                          color="neutral"
                          sx={{ marginBottom: 1, height: '2.5rem' }}
                          selected={menu.active}
                          variant={menu.active ? 'soft' : 'plain'}
                        >
                          <ListItemDecorator
                            sx={{ 
                              color: menu.active ? 'inherit' : 'neutral.500',
                            }}
                          >
                            {menu.icon}
                          </ListItemDecorator>
                          <ListItemContent>{menu.label}</ListItemContent>
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </ListItem>
              <ListItem>
                <ListItemButton className='h-10'
                  onClick={handleChangeTheme}
                >
                  <Tooltip title="Theme">
                    <ListItemDecorator>
                      {mode === 'dark' ? (
                        <DarkModeIcon fontSize="small"/>
                      ) : (
                        <WbSunnyIcon fontSize="small"/>
                      )}
                    </ListItemDecorator>
                  </Tooltip>
                  <ListItemContent>{t('Theme')}</ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton className='h-10'
                  onClick={() => {
                    const language = i18n.language === 'en' ? 'zh' : 'en'
                    i18n.changeLanguage(language)
                    window.localStorage.setItem('lng', language)
                  }}
                >
                  <Tooltip title='Switch Language'>
                    <ListItemDecorator className='text-2xl'>
                      <LanguageIcon fontSize='small' />
                    </ListItemDecorator>
                  </Tooltip>
                  <ListItemContent>{t('Switch Language')}</ListItemContent>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton className='h-10'
                  onClick={() => { setIsMenuExpand(false) }}
                >
                  <Tooltip title="Close Sidebar">
                    <ListItemDecorator className='text-2xl'>
                      <ExpandIcon className='transform rotate-90' fontSize='small' />
                    </ListItemDecorator>
                  </Tooltip>
                  <ListItemContent>{t('Close Sidebar')}</ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </div>
      </>
    )
  }

  function notExpandMenu() {
    return (
      <Box className="h-full py-6 flex flex-col justify-between">
        <Box className='flex justify-center items-center'>
          <Tooltip title="Menu">
            <MenuIcon className='cursor-pointer text-2xl' onClick={() => {setIsMenuExpand(true)}}/>
          </Tooltip>
        </Box>
        <Box className="flex flex-col gap-4 justify-center items-center">
          {menus.map((menu, index) => (
            <div className='flex justify-center text-2xl cursor-pointer' key={`menu_${index}`}>
              <Tooltip title={menu.tooltip}>
                {menu.icon}
              </Tooltip>
            </div>
          ))}
          <ListItem>
            <ListItemButton
              onClick={handleChangeTheme}
            >
              <Tooltip title="Theme">
                <ListItemDecorator className="text-2xl">
                  {mode === 'dark' ? (
                    <DarkModeIcon fontSize="small"/>
                  ) : (
                    <WbSunnyIcon fontSize="small"/>
                  )}
                </ListItemDecorator>
              </Tooltip>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => { setIsMenuExpand(true) }}
            >
              <Tooltip title="Expand Sidebar">
                <ListItemDecorator className='text-2xl'>
                  <ExpandIcon className='transform rotate-90' fontSize='small' />
                </ListItemDecorator>
              </Tooltip>
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    )
  }

	return (
		<>
			<nav className={classNames('grid max-h-screen h-full max-md:hidden')}>
        <Box className="flex flex-col border-r border-divider max-h-screen sticky left-0 top-0 overflow-hidden">
          {isMenuExpand ? expandMenu() : notExpandMenu()}
        </Box>
			</nav>
		</>
	)
};

export default LeftSide;
