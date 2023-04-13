import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import { DateFormatter } from '../../utils/date';
import useMutation from '../../lib/client/useMutation';

interface AuthorForm {
  name: string;
}

interface tweetDetailForm {
  id: number;
  createdAt: string;
  author: AuthorForm;
  authorId: number;
  content: string;
}

interface TweetDetailResponse {
  ok: boolean;
  tweetDetail: tweetDetailForm;
  isLiked: boolean;
}

export default () => {
  const router = useRouter();
  const {
    data: tweetDetailData,
    error: tweetDetailError,
    mutate,
  } = useSWR<TweetDetailResponse>(
    router.query.id ? `/api/tweet/${router.query.id}` : null
  );

  const [toggleLike] = useMutation(`/api/tweet/${router.query.id}/like`);
  const onLikeClick = () => {
    if (!tweetDetailData) return;
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleLike({});
  };

  return (
    <div className='relative mt-5'>
      <Link legacyBehavior href='/'>
        <a className='text-sm text-gray-500 hover:underline'>
          이전으로 돌아가기
        </a>
      </Link>
      <div
        className='bg-gray-50 mt-10 mb-5 p-8 rounded-md'
        key={tweetDetailData?.tweetDetail!.id}
      >
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
            <h1 className='text-gray-600'>
              {tweetDetailData?.tweetDetail.author.name}
            </h1>
          </div>
          <div className='text-gray-500 text-sm'>
            {DateFormatter(tweetDetailData?.tweetDetail.createdAt!, 'ko')}
          </div>
        </div>
        <h1>{tweetDetailData?.tweetDetail.content}</h1>
      </div>
      <div
        onClick={onLikeClick}
        className='w-28 m-auto cursor-pointer rounded-md py-2 border border-gray-300 flex justify-center space-x-1 items-center'
      >
        <span
          className={
            tweetDetailData?.isLiked
              ? 'text-red-500  hover:text-red-600'
              : 'text-gray-400  hover:text-gray-500'
          }
        >
          좋아요
        </span>
        <button
          className={
            tweetDetailData?.isLiked
              ? 'text-red-500  hover:text-red-600'
              : 'text-gray-400  hover:text-gray-500'
          }
        >
          {tweetDetailData?.isLiked ? (
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
                strokeWidth='2'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
