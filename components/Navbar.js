import { useEffect, useState } from 'react'
import Link from 'next/link'
import style from '../styles/Navbar.module.css'
import idn from '../lang/ind'
import en from '../lang/en'

const Navbar = () => {
    const [time, setTime] = useState('')
    const [bahasa, setBahasa] = useState('')
    // mendapatkan waktu 
    useEffect(() => {
        setInterval(() => {
            setTime((new Date()).toLocaleString('id-ID'))
        }, 1000)
    }, [time])
    // memeriksa bahasa yang dipilih user
    useEffect(() => {
        setBahasa(localStorage.getItem('lang') == 'idn' ? idn : en)
    },[])
    // handle klik logged out
    const setStatus = () => {
        sessionStorage.setItem('loginstatus', 'logout')
        window.location.href = "/"
    }
    return (
        <nav className={style.navbar}>
            <div className={style.mini}>
                <p>{bahasa.waktu} - {time}</p>
                <p>PPA Dashboard</p>
                <p>{bahasa.loginas}, <strong>User</strong></p>
            </div>
            <div className={style.nav}>
                <img src="./images/ppa.png" alt="logoppa" width="40" style={{marginRight: '150px'}}/>
                <div className={style.centermenu}>
                    <div className={style.mainmenu}>
                        Production
                        <div className={style.submenu}>
                            <Link href="/production/loader">By Loader</Link>
                            <Link href="/production/hauler">By Hauler</Link>
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
                    <a className={style.logoutbtn} onClick={setStatus} title="Log out"><i className="fi fi-rr-exit"></i></a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar