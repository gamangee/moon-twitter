import { NextPage } from 'next';
import React from 'react';
import useUser from 'lib/client/useUser';

const Home: NextPage = () => {
  const user = useUser();
  console.log('user', user);
  return <div>hi</div>;
};
export default Home;
