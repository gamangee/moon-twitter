import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';

interface SignUpForm {
  name: string;
  email: string;
}

export default () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const onClickToggleModal = () => {
    setIsOpenModal((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>();

  const onValid = async (data: SignUpForm) => {
    const request = await fetch('/api/create-account', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (request.status === 200) {
      resetField('email');
      setIsOpenModal(true);
      setMessage('이미 계정을 가지고 있습니다.');
    }
    if (request.status === 201) {
      reset();
      setIsOpenModal(true);
      setMessage('회원 가입을 완료했습니다.');
    }
  };

  const onSubmit = (data: SignUpForm) => onValid(data);

  useEffect(() => {
    if (message === '회원 가입을 완료했습니다.' && !isOpenModal) {
      router.push('/log-in');
    }
  }, [router, message, isOpenModal]);

  return (
    <div className='mt-10'>
      {isOpenModal && (
        <Modal message={message} onClickToggleModal={onClickToggleModal} />
      )}
      <div className='flex justify-center my-10'>
        <svg
          className='w-10 h-10 text-blue-500'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
        </svg>
      </div>
      <h3 className='text-center text-3xl font-bold'>CREATE-ACCOUNT</h3>
      <form
        className='mt-8 flex flex-col space-y-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor='name'
            className='mb-1 block text-sm font-medium text-gray-700'
          >
            이름:{' '}
          </label>
          <div className='rounded-md flex  items-center shadow-sm'>
            <input
              {...register('name', { required: true, minLength: 2 })}
              type='text'
              id='name'
              className='appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          {errors?.name && (
            <div className='text-red-500'>이름을 입력해주세요.</div>
          )}
        </div>
        <div>
          <label
            htmlFor='email'
            className='mb-1 block text-sm font-medium text-gray-700'
          >
            이메일:{' '}
          </label>
          <div className='rounded-md flex  items-center shadow-sm'>
            <input
              {...register('email', { required: true })}
              type='email'
              id='email'
              className='appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          {errors?.email && (
            <div className='text-red-500'>이메일을 입력해주세요.</div>
          )}
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 hover:bg-blue-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none py-3 text-base'
        >
          가입하기
        </button>
      </form>
      <div className='text-gray-500 my-5 text-center'>
        이미 계정이 있으신가요?
        <Link href='/log-in'>
          <span className='text-blue-500 font-bold hover:cursor-pointer hover:text-blue-600 hover:underline'>
            {' '}
            로그인하기
          </span>
        </Link>
      </div>
    </div>
  );
};
