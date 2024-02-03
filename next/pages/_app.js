import Head from 'next/head';
import Router from 'next/router';
import Link from 'next/link';
import { useLocalStorage } from '@rehooks/local-storage';
import info from '../lib/info.json'

export default function MyApp({ Component, pageProps }) {
  const [token] = useLocalStorage('jwt');
  return (
    <>
      <Head>
        <title>{info.title}</title>
      </Head>
      <nav>
        <Link href="/">Home</Link>
        {
          token !== undefined ?
          <button onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("jwt");
            Router.reload();
          }}>Sign out</button>
          :
          <>
            <br/>
            <Link href="/register">Register</Link>
            <br/>
            <Link href="/login">Login</Link> 
          </>
        }
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
