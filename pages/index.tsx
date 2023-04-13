import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { DateFormatter } from '../utils/date';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import Link from 'next/link';
import cls from '../utils/utils';

interface UserResponse {
  ok: boolean;
  user: User;
}

interface AuthorResponse {
  name: string;
}

interface Tweet {
  id: number;
  content: string;
  author: AuthorResponse;
  authorId: number;
  createdAt: string;
  _count: {
    likes: number;
  };
}

interface TweetResponse {
  ok: boolean;
  tweets: Tweet[];
}

interface TweetForm {
  content: string;
}

export default () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [createTweet, setCreateTweet] = useState<boolean>(false);

  const onClickToggleModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  const { data: userData, error: userError } =
    useSWR<UserResponse>('/api/user');

  useEffect(() => {
    if (!userData && !userError) {
      return;
    }
    if (!userData?.ok) {
      router.push('/create-account');
    }
  }, [userData, userError]);

  const { data: tweetData, mutate } = useSWR<TweetResponse>('/api/tweet');

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<TweetForm>();

  const onValid = async (data: TweetForm) => {
    const created = await fetch('/api/tweet/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!created) {
      resetField('content');
      setIsOpenModal(true);
      setMessage('다시 트윗해주세요.');
    } else {
      resetField('content');
      setIsOpenModal(true);
      setMessage('트윗 성공💖!');
      setCreateTweet(false);
      mutate();
    }
  };

  const onSubmit = (data: TweetForm) => onValid(data);

  const onLogout = async () => {
    const req = await fetch('/api/log-out');
    if (req.ok) {
      router.push('/log-in');
    }
  };

  return (
    <div>
      <button
        className='mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none py-3 text-base'
        onClick={() => setCreateTweet((prev) => !prev)}
      >
        트윗 추가하기
      </button>
      {isOpenModal && (
        <Modal message={message} onClickToggleModal={onClickToggleModal} />
      )}
      {createTweet && (
        <>
          <div
            className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black opacity-80 flex'
            onClick={() => setCreateTweet((prev) => !prev)}
          />
          <form
            className='text-center bg-white border-2 border-gray-200 flex flex-col items-center p-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-md'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className='text-2xl font-bold' htmlFor='content'>
              {userData?.user.name}님의 새로운 트윗💘
            </label>
            <textarea
              className='w-full border-2 text-center border-gray-200 rounded-sm outline-none my-6 h-36'
              id='content'
              maxLength={200}
              placeholder='새로운 트윗을 추가해주세요. (최대 200자)'
              {...register('content', { required: true })}
            />
            {errors.content && (
              <div className='text-red-500 mb-3'>내용을 입력해주세요.</div>
            )}
            <button
              type='submit'
              className='w-full bg-blue-500 hover:bg-blue-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none py-3 text-base'
            >
              트윗하기
            </button>
          </form>
        </>
      )}
      <div className=''>
        {tweetData?.tweets.map((tweet: Tweet) => (
          <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
            <a
              className={cls(
                'relative',
                isOpenModal || createTweet ? '-z-50' : ''
              )}
            >
              <div className='bg-gray-50 my-5 p-5 rounded-md hover:bg-blue-50'>
                <div className='flex justify-between items-start'>
                  <div className='flex items-center space-x-2 mb-4'>
                    <div className='w-8 h-8 bg-blue-500 rounded-lg flex justify-center items-center'>
                      <svg
                        className='w-4 h-4 text-white'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
                      </svg>
                    </div>
                    <h1 className='text-gray-600'>{tweet.author.name}</h1>
                  </div>
                  <div className='text-gray-500 text-sm'>
                    {DateFormatter(tweet.createdAt, 'ko')}
                  </div>
                </div>
                <h1>{tweet.content}</h1>
                <div className='text-red-500 absolute bottom-5 right-5'>
                  {tweet._count.likes ? (
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className='w-5 h-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='1'
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                  )}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div
        onClick={onLogout}
        className={cls(
          'flex justify-center items-center border-2 border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 fixed bottom-10 right-10 rounded-full w-16 h-16 cursor-pointer transition-all',
          isOpenModal || createTweet ? '-z-50' : ''
        )}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
          />
        </svg>
      </div>
    </div>
  );
};
