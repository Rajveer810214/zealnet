import React, { useEffect, useState } from 'react';
import Login from './login';
import Image from 'next/image';
import Loading from 'react-loading';
import logo_W from '../Image/Breaking.png';
import styles from '../styles/front.module.css';
// import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

import {useRouter} from 'next/router';

const Front = () => {
  const router =  useRouter();
  const handlesignup = () => {
    if(localStorage.getItem('auth-token')!==null){
      router.push('/dashboard');
    }
    else{
      router.push('/login');
    }
  }
  const handlestarted = () => {
    if(localStorage.getItem('auth-token')!==null){
      router.push('/dashboard');
    }
    else{
      router.push('/login');
    }
  }

  return (
    <div className={styles.front}>
      <div className={styles.frontchild}>
      
      <Image src={logo_W} className={styles.logo} />
      <div className={styles.buttons}>
      <Button variant="outlined" onClick={handlesignup} className={styles.btnsignup}>Sign in</Button>
      <Button variant="outlined" onClick={handlestarted} className={styles.btngetstarted}>Get Started</Button>
      </div>

      </div>
    </div>
  );
};

export default Front;
