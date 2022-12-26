import styles from '../styles/Footer.module.css';
import React, { useState, useEffect } from 'react'
import Eng from '../lang/en.json'
import Ind from '../lang/ind.json'

const Footer = () => {
    const [lang, setLang] = useState('')
    useEffect(() => {
        let lang = localStorage.getItem('lang') == 'idn' ? 'idn' : 'eng'
        setLang(lang)
    })
    let bahasa = lang == 'idn' ? Ind : Eng
    return (
        <footer className={styles.footer}>
            <h3>PPA Teamwork Operation - SS6 Development</h3>
            <p>{bahasa.slogan}</p>         
        </footer>
    )
}

export default Footer