"use client";
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { Button, Textarea, Box, buttonClasses, Divider, Typography } from '@/lib/mui';
import IconButton from '@mui/joy/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendPostRequest } from '@/utils/request';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

function Home() {
  const Schema = z.object({ query: z.string().max(4000) });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { reset, handleSubmit, register, watch, formState: { errors } } = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {},
  });
  const { data: scenesList } = useRequest(async () => await sendPostRequest('/v1/chat/dialogue/scenes'));
  const queryLen = watch('query')?.length
  const excessMax = queryLen > 4000

  const submit = async ({ query }: z.infer<typeof Schema>) => {
    try {
      setIsLoading(true);
      reset();
      const res = await sendPostRequest('/v1/chat/dialogue/new', {
        chat_mode: 'chat_normal'
      });
      if (res?.success && res?.data?.conv_uid) {
        router.push(`/chat?id=${res?.data?.conv_uid}&initMessage=${query}`);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='mx-auto h-full justify-center flex max-w-3xl flex-col gap-8 px-5 pt-6'>
        <div className='my-0 mx-auto'>
          <Image
            src="/LOGO.png"
            alt="Revolutionizing Database Interactions with Private LLM Technology"
            width={856}
            height={160}
            className='w-full'
            unoptimized
          />
        </div>
        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-3'>
            <Divider className="text-[#878c93]">Quick Start</Divider>
            <Box
              className='grid pt-7 rounded-xl gap-2 lg:grid-cols-3 lg:gap-6'
              sx={{
                [`& .${buttonClasses.root}`]: {
                  color: 'var(--joy-palette-primary-solidColor)',
                  backgroundColor: 'var(--joy-palette-primary-solidBg)',
                  height: '52px',
                  '&: hover': {
                    backgroundColor: 'var(--joy-palette-primary-solidHoverBg)',
                  }
                }, 
                [`& .${buttonClasses.disabled}`]: {
                  cursor: 'not-allowed',
                  pointerEvents: 'unset',
                  color: 'var(--joy-palette-primary-plainColor)',
                  backgroundColor: 'var(--joy-palette-primary-softDisabledBg)',
                  '&: hover': {
                    backgroundColor: 'var(--joy-palette-primary-softDisabledBg)',
                  }
                }
              }}
            >
              {scenesList?.data?.map((scene) => (
                <Button
                  key={scene['chat_scene']}
                  disabled={scene?.show_disable}
                  size="md"
                  variant="solid"
                  className='text-base rounded-none'
                  onClick={async () => {
                    const res = await sendPostRequest('/v1/chat/dialogue/new', {
                      chat_mode: scene['chat_scene']
                    });
                    if (res?.success && res?.data?.conv_uid) {
                      router.push(`/chat?id=${res?.data?.conv_uid}&scene=${scene['chat_scene']}`);
                    }
                  }}
                >
                  {scene['scene_name']
                }</Button>
              ))}
            </Box>
          </div>
        </div>
        <div className='mt-6 mb-[10%] pointer-events-none inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center max-md:border-t xl:max-w-4xl [&>*]:pointer-events-auto'>
          <form
            style={{
              maxWidth: '100%',
              width: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
              overflow: 'visible',
              background: 'none',
              justifyContent: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 'auto'
            }}
            onSubmit={(e) => {
              handleSubmit(submit)(e);
            }}
          >
            <Textarea
              className="w-full"
              variant="outlined"
              placeholder='Ask anything'
              maxRows={3}
              error={excessMax}
              endDecorator={
                <div className="flex-1 flex justify-between items-center">
                  <Typography color="neutral">
                    <Typography color={excessMax ? "danger" : "neutral"}>{queryLen}</Typography> / 4000
                  </Typography>
                  <IconButton type="submit" disabled={isLoading}>
                    <SendRoundedIcon />
                  </IconButton>
                </div>
              }
              {...register('query')}
            />
            {(errors.query || excessMax) && (
              <Typography color="danger">
                {errors.query?.message || 'String must contain at most 4000 character(s)'}
              </Typography>
            )}
          </form>
        </div>
      </div>
    </>    
  )
}

export default Home;
