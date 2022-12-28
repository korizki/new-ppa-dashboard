import style from '@/styles/TopBar.module.css'
import {useState} from 'react'
const TopBar = (listItem) => {
    const [activeTab, setActiveTab] = useState(1)
    return (
        <div className={style.content}>
            <div className={style.activenav}>
                <a
                    className={activeTab == 1 ? style.active : ''}
                    onClick={() => setActiveTab(1)}
                ><i className="fi fi-rr-confetti"></i> Cycle</a>
                <a
                    className={activeTab == 2 ? style.active : ''}
                    onClick={() => setActiveTab(2)}
                ><i className="fi fi-rr-time-past"></i> Truck Count</a>
            </div>
        </div>
    )
}

export default TopBar