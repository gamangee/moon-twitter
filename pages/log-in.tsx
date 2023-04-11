// 로그인 여부를 확인하여
// 로그인이 되어있다면 홈페이지를
// 그렇지 않다면 계정 생성 / 로그인 페이지로 이동

// 로그인이 완료되었을 경우, 사용자는 데이터베이스에 존재하는 모든 트윗을 볼 수 있어야 합니다.
// 또한 트윗을 작성할 수 있어야 합니다.

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Button from 'components/button';
import Input from 'components/input';
import { cls } from 'lib/utils';
import useMutation from 'lib/client/useMutaion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface loginForm {
  email?: string;
  phone?: string;
}

interface MutationResult {
  ok: boolean;
}

const Login: NextPage = () => {
  const [login, { loading, data, error }] =
    useMutation<MutationResult>('/api/login');

  const { register, handleSubmit, reset } = useForm<loginForm>();

  const [method, setMethod] = useState<'email' | 'phone'>('email');

  const onEmailClick = () => {
    reset();
    setMethod('email');
  };

  const onPhoneClick = () => {
    reset();
    setMethod('phone');
  };

  const onValid = (validForm: loginForm) => {
    if (loading) return;
    login(validForm);
  };

  const router = useRouter();

  useEffect(() => {
    if (data?.ok) {
      router.push('/');
    }
    if (error) {
      router.push('/create-account');
    }
  }, [data, router, error]);

  return (
    <div className='mt-16 px-4'>
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
      <h3 className='text-center text-3xl font-bold'>Login</h3>
      <div className='mt-12'>
        <div className='flex flex-col items-center'>
          <div className='mt-8  grid  w-full grid-cols-2 border-b '>
            <button
              className={cls(
                'border-b-2 pb-4 text-sm font-medium',
                method === 'email'
                  ? ' border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-400'
              )}
              onClick={onEmailClick}
            >
              Email
            </button>
            <button
              className={cls(
                'border-b-2 pb-4 text-sm font-medium',
                method === 'phone'
                  ? ' border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-400'
              )}
              onClick={onPhoneClick}
            >
              Phone
            </button>
          </div>
        </div>
        <form
          className='mt-8 flex flex-col space-y-4'
          onSubmit={handleSubmit(onValid)}
        >
          {method === 'email' ? (
            <Input
              register={register('email', {
                required: true,
              })}
              name='email'
              label='Email address'
              type='email'
              required
            />
          ) : null}
          {method === 'phone' ? (
            <Input
              register={register('phone', { required: true })}
              name='phone'
              label='Phone number'
              type='number'
              kind='phone'
              required
            />
          ) : null}
          {method === 'email' ? (
            <Button text={loading ? 'loading' : '로그인'} />
          ) : null}
          {method === 'phone' ? (
            <Button text={loading ? 'loading' : '로그인'} />
          ) : null}
        </form>
        <div className='text-gray-500 my-5 text-center'>
          계정이 없으신가요?
          <Link href='/create-account'>
            <span className='text-blue-500 font-bold hover:cursor-pointer hover:text-blue-600 hover:underline'>
              가입하기
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
