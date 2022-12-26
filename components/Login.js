import style from '../styles/Login.module.css'
import { useState, useRef, useEffect } from 'react'
import $ from 'jquery'
import idn from '../lang/ind.json'
import eng from '../lang/en.json'
import { useRouter } from 'next/router'
import { removeToken } from '../features/checkAuth'
import MiniWarning from '@/components/MiniWarning'

export default function Login() {
    const [loginStatus, setLoginStatus] = useState('')
    const [bahasa, setBahasa] = useState('')
    const [lang, setLang] = useState('')
    const [sessExpired, setSessExpired] = useState(false)
    const inputUsername = useRef()
    const router = useRouter()
    // memeriksa bahasa
    useEffect(() => {
        setBahasa(localStorage.getItem('lang') == 'idn' ? idn : eng)
        setLang(localStorage.getItem('lang') == 'idn' ? false : true)
    }, [lang])
    // cek apakah session sudah berakhir
    useEffect(() => {
        // remove token dari local storage
        removeToken()
        if (localStorage.getItem('tokenstatus') == 'expired') {
            setSessExpired(true)
            localStorage.removeItem('tokenstatus')
            setTimeout(() => {
                setSessExpired(false)
            }, 5000)
        }
        // handle cek apakah logout
        setLoginStatus(sessionStorage.getItem('loginstatus') ? sessionStorage.getItem('loginstatus') : '')
        setTimeout(() => {
            sessionStorage.removeItem('loginstatus')
        },1000)
    }, [])
    // handle submit login
    const submitLogin = (e) => {
        e.preventDefault()
        let loginData = new FormData(document.querySelector('#formLogin'))
        loginData.append("app_module", "PPA Dashboard")
        // proses login
        $.ajax({
            url: `http://ss6api.ppa-mhu.net/ppa-employee-api/api/cico/integratedLogin`,
            method: 'POST',
            data: loginData,
            processData: false,
            contentType: false,
            success: (data) => {
                if (data.status == 200) {
                    sessionStorage.setItem('app_token', data.token)
                    router.push('dashboard')
                } else {
                    setLoginStatus('failed')
                    document.querySelector('#formLogin').reset()
                    inputUsername.current.focus()
                    setTimeout(() => {
                        setLoginStatus('')
                    }, 5000)
                }
            }
        })
    }
    // ganti bahasa
    const switchLang = (e) => {
        setLang(e.target.checked)
        e.target.checked ? localStorage.setItem('lang', 'eng') : localStorage.setItem('lang', 'idn')
    }
    return (
        <div className={style.box}>
            <label className={style.toggle} title={bahasa.switchlang}>
                <input type="checkbox" onChange={switchLang} checked={lang == true} />
                <span className={style.slider}></span>
            </label>
            <p className={style.notiflang}>{lang ? 'ENG' : 'IDN'}</p>
            <div className={style.form}>
                <div className={style.header}>
                    <img src="./images/ss6.png" width="50" />
                    <h2>SafeStrong</h2>
                </div>
                <form id="formLogin" onSubmit={submitLogin} >
                    <div className="section">
                        <label>Username</label>
                        <input type="text" name="nrp" ref={inputUsername} required />
                    </div>
                    <div className="section">
                        <label>Password</label>
                        <input type="password" name="password" required />
                    </div>
                    <button className={style.loginBtn}><i className="fi fi-rr-sign-in-alt"></i> Log In</button>
                </form>
                {
                    loginStatus == 'failed' && ( 
                        <MiniWarning 
                            type="errmsg" 
                            icon="ban"
                            detail={bahasa.loginstatus}
                        /> 
                    )
                }
                {
                    sessExpired && ( 
                        <MiniWarning 
                            type="errmsg" 
                            icon="ban"
                            detail={bahasa.sesStatus} 
                        /> 
                    )
                }{
                    loginStatus == 'logout' && (
                        <MiniWarning
                            type="infomsg"
                            icon="info"
                            detail={bahasa.suksesLogout} 
                        />
                    )
                }
            </div>
        </div>
    )
}