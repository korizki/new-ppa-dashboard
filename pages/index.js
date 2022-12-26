import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Footer from '@/components/Footer'
import Login from '@/components/Login'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login User - PPA Dashboard</title>
        <meta name="description" content="PT. Putra Perkasa Abadi | Web monitoring performa dan administrasi site." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.wrapper}>
        <Login />
        <Footer />
      </div>
    </div>
  )
}
