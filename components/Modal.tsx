import React, { PropsWithChildren } from 'react';

interface ModalProps {
  message: string;
  onClickToggleModal: () => void;
}

const Modal = ({
  message,
  onClickToggleModal,
}: PropsWithChildren<ModalProps>) => {
  return (
    <>
      <div
        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black opacity-80 flex'
        onClick={onClickToggleModal}
      />
      <div className='flex flex-col items-center p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 rounded-md shadow-xl bg-white'>
        <h1 className='font-bold text-xl my-10'>{message}</h1>
        <button
          onClick={onClickToggleModal}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none py-3 text-base'
        >
          확인
        </button>
      </div>
    </>
  );
};

export default Modal;
