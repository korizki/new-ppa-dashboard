import Head from 'next/head'
import style from '@/styles/Main.module.css'
import { useEffect } from "react"
import {useSelector} from 'react-redux'
import { checkAuth } from '../../features/checkAuth'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const Dashboard = () => {
    const bahasa = useSelector(state => state.languageReducer.dictionary)
    // pengecekkan token jwt
    useEffect(() => {
        checkAuth()
    }, [])
    return (
        <div className={style.boxs}>
            <Head>
                <title>Main Page - PPA Dashboard</title>
                <meta name="description" content="Halaman utama Dashboard PPA, berisi informasi summary Total Loader dan Update data Fleet Management System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <h1>Welcome to Dashboard 🥳</h1>
            <Footer />
        </div>
    )
}

export default Dashboard