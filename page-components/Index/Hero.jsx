import { ButtonLink } from '@/components/Button';
import { Button } from '@/components/Button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetcher } from '@/lib/fetch';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/lib/user';
import toast from 'react-hot-toast';

import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';


import { GoogleOAuthProvider,GoogleLogin } from "@react-oauth/google";
import jwt_deocde from "jwt-decode";

const Hero = () => {
  const router = useRouter();
  const { mutate } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const clicked =  useCallback(
    async (e) => {
     
      try {
        setIsLoading(true);
        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'opa@dendi.com',
            name:'This lol',
            password: '123123123',
            username: 'usernameRef.cu',
          }),
        });
        mutate({ user: response.user }, false);
        toast.success('Your account has been created');
        router.replace('/feed');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, router]
  );
  const clicked2 =  useCallback(
    async (googleResponse) => {
      // console.log(googleResponse)
      // console.log(jwt_deocde(googleResponse.credential))
      
     
      try {
        setIsLoading(true);
        let uinfo = jwt_deocde(googleResponse.credential)

        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: uinfo.email,
            name: uinfo.name,
            password: (Math.random() + 1).toString(36).substring(2),
            username: uinfo.email,
          }),
        });
        mutate({ user: response.user }, false);
        toast.success('Your account has been created');
        router.replace('/feed');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, router]
  );
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Next.js</span>
          <span className={styles.mongodb}>MongoDB</span>
          <span>App</span>
        </h1>
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/feed">
              <ButtonLink className={styles.button}>Explore Feed</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/hoangvvo/nextjs-mongodb-app"
              type="secondary"
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          A Next.js and MongoDB web application, designed with simplicity for
          learning and real-world applicability in mind.
        </p>
        <Button
          onClick={clicked}
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          user1
        </Button>
        <GoogleOAuthProvider clientId="850364421534-9f2re6djtki6sm8dh02ml8j0dg11fvih.apps.googleusercontent.com">
     
        <GoogleLogin
          text="signin_with"
          theme="filled_blue"
          size="large"
          ux_mode="popup"
          onSuccess={clicked2} 
          // => {
          //   console.log(credentialResponse);
          //   let userCred = credentialResponse.credential;
          //   let payload = jwt_deocde(credentialResponse.credential);
          //   console.log(payload);
          // }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        
      </GoogleOAuthProvider>
      </div>
    </Wrapper>
  );
};

export default Hero;
