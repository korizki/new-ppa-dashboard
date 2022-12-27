import styles from '../styles/Footer.module.css';
import React, { useState, useEffect } from 'react'
import Eng from '../lang/en.json'
import Ind from '../lang/ind.json'
import {useSelector} from 'react-redux'

const Footer = () => {
    const lang = useSelector(state => state.languageReducer.lang)
    let bahasa = lang == 'idn' ? Ind : Eng
    return (
        <footer className={styles.footer}>
            <h3>PPA Teamwork Operation - SS6 Development</h3>
            <p>{bahasa.slogan}</p>         
        </footer>
    )
}

export default Footer