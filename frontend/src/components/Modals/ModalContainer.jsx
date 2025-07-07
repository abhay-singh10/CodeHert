import React from 'react';
import { useSelector } from 'react-redux';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const ModalContainer = () => {
  const { modals } = useSelector((state) => state.ui);

  return (
    <>
      {modals.loginModal && <LoginModal />}
      {modals.registerModal && <RegisterModal />}
    </>
  );
};

export default ModalContainer; 