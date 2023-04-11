import Button from '@components/button';
import Input from '@components/input';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

interface SignupForm {
  name: string;
  email: string;
}

export default () => {
  const { register, handleSubmit, reset } = useForm<SignupForm>();
  const router = useRouter();

  const onValid = async (data: SignupForm) => {
    const request = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (request.status === 200) {
      alert('이미 계정이 있습니다!');
    }
    if (request.status === 201) {
      alert('계정을 생성하였습니다!');
    }
    if (request.status !== 405) {
      router.push('/log-in');
    }
    reset();
  };

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
      <h3 className='text-center text-3xl font-bold'>회원가입</h3>
      <form
        onSubmit={handleSubmit(onValid)}
        className='mt-8 flex flex-col space-y-4'
      >
        <Input
          register={register('name', {
            required: true,
          })}
          name='name'
          label='이름'
          type='text'
          required
        />
        <Input
          register={register('email', {
            required: true,
          })}
          name='email'
          label='이메일'
          type='email'
          required
        />
        <Button text='가입하기' />
      </form>
    </div>
  );
};
