import style from '@/styles/WaitMessage.module.css'
import Image from 'next/image'

const LoadingMessage = () => {
    return (
        <div className={style.waitmessage}>
            <div className={style.waitcontent}>
                <span className={style.spinner}></span>
                <Image src="/images/ss6.png" priority="lazy" alt="logoss6" width="50" height="50"/>
            </div>
        </div>
    )
}

export default LoadingMessage