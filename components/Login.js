import style from '../styles/Login.module.css'
import {useState, useRef, useEffect} from 'react'
import idn from'../lang/ind.json'
import eng from'../lang/en.json'

export default function Login() {
    const [loginStatus, setLoginStatus] = useState('')
    const [bahasa, setBahasa] = useState('')
    const [lang, setLang] = useState('')
    const inputUsername = useRef()
    // memeriksa bahasa
    useEffect(() => {
        setBahasa(localStorage.getItem('lang') == 'idn' ? idn : eng)
        setLang(localStorage.getItem('lang') == 'idn' ? false : true)
    },[lang])
    // handle submit login
    const submitLogin = (e) => {
        e.preventDefault()
        const loginData = new FormData(document.querySelector('#formLogin'))
        const data = Object.fromEntries(loginData.entries())
        // on failed login
        if(data.username != 'rizki'){
            setLoginStatus('failed')
            document.querySelector('#formLogin').reset()
            inputUsername.current.focus()
            setTimeout(() => {
                setLoginStatus('')
            },5000)
        } else {
            alert('login berhasil')
        }
    }
    // ganti bahasa
    const switchLang = (e) => {
        setLang(e.target.checked)
        e.target.checked ? localStorage.setItem('lang','eng') : localStorage.setItem('lang', 'idn')
    }
    return (
        <div className={style.box}>
            <label className={style.toggle} title={bahasa.switchlang}>
                <input type="checkbox" onChange={switchLang} checked={lang == true}/>
                <span className={style.slider}></span>
            </label>
            <p className={style.notiflang}>{lang ? 'ENG' : 'IDN'}</p>
            <div className={style.form}>
                <div className={style.header}>
                    <img src="./images/ss6.png" width="50"/>
                    <h2>SafeStrong</h2>
                </div>
                <form id="formLogin" onSubmit={submitLogin} >
                    <div className="section">
                        <label>Username</label>
                        <input type="text" name="username" ref={inputUsername} required />
                    </div>
                    <div className="section">
                        <label>Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <button className={style.loginBtn}><i className="fi fi-rr-sign-in-alt"></i> Log In</button>
                </form>
                {
                    loginStatus == 'failed' ? (
                        <p className={style.errmsg}><i className="fi fi-rr-ban"></i> {bahasa.loginstatus}</p>
                    ) : '' 
                }
            </div>
        </div>
    )
}