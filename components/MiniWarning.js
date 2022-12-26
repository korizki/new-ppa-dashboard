import style from '../styles/MiniWarning.module.css'
const MiniWarning = (props) => {
    const {detail, type, icon} = props
    return (
        <p className={`${style[type]} ${style.info}`}><i className={`fi fi-rr-${icon}`}></i>{detail}</p>
    )
}

export default MiniWarning