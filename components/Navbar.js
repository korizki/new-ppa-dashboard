import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import style from '../styles/Navbar.module.css'
import WaitMessage from '@/components/LoadingMessage'
import idn from '../lang/ind'
import en from '../lang/en'

const Navbar = () => {
    const [time, setTime] = useState('')
    const [bahasa, setBahasa] = useState('')
    const [showWait, setShowWait] = useState(false)
    // mendapatkan waktu 
    useEffect(() => {
        setInterval(() => {
            setTime((new Date()).toLocaleString('id-ID'))
        }, 1000)
    }, [time])
    // memeriksa bahasa yang dipilih user
    useEffect(() => {
        setBahasa(localStorage.getItem('lang') == 'idn' ? idn : en)
        setShowWait(false)
    },[])
    // handle klik logged out
    const setStatus = () => {
        sessionStorage.setItem('loginstatus', 'logout')
        window.location.href = "/"
    }
    const showHideWaitMessage = () => {
        setShowWait(true)
        setTimeout(() => {
            setShowWait(false)
        },3000)
    }
    return (
        <nav className={style.navbar}>
            {
                showWait ? (<WaitMessage />) : ''
            }
            <div className={style.mini}>
                <p>{bahasa.waktu} - {time}</p>
                <p>Flash message here!</p>
                <p>{bahasa.loginas}, <strong>User</strong><a className={style.logoutbtn} onClick={setStatus} title="Log out">- Log Out</a></p>
            </div>
            <div className={style.nav}>
                <Link href="/dashboard"><Image src="/images/ppa.png" alt="logoppa" priority="lazy" width={40} height={40} style={{marginRight: '150px', transform: 'translateY(3px)'}} /></Link>
                <div className={style.centermenu}>
                    <div className={style.mainmenu}>
                        Production
                        <div className={style.submenu}>
                            <Link href="/production/loader">By Loader</Link>
                            <Link href="/production/hauler" onClick={showHideWaitMessage}>By Hauler</Link>
                        </div>
                    </div>
                    <div className={style.mainmenu}>
                        Fuel
                        <div className={style.submenu}>
                            <Link href="/fuel/storage">Fuel Storage</Link>
                            <Link href="/fuel/tank">Main Tank</Link>
                        </div>
                    </div>
                    <div className={style.mainmenu}>
                        Safety Dump
                        <div className={style.submenu}>
                            <Link href="/sdump/chart">Chart</Link>
                            <Link href="/sdump/map">Map</Link>
                            <Link href="/sdump/detail">Detail</Link>
                        </div>
                    </div>
                </div>
                <div className={style.rightmenu}>
                    <i className="fi fi-rr-search"></i>
                    <input type="text" className={style.inputsrcmenu} placeholder={bahasa.carimenu}/>
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar