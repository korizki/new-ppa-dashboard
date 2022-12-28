import style from '@/styles/TopBar.module.css'
import {useState} from 'react'
const TopBar = ({listItem, setActive}) => {
    const [activeTab, setActiveTab] = useState(1)
    const handleClick = (param) => {
        setActiveTab(param)
        setActive(param)
    }
    return (
        <div className={style.activenav}>
            {
                listItem.map(item => (
                    <a key={item.id}
                        className={activeTab == item.id ? style.active : ''}
                        onClick={() => handleClick(item.id)}
                    ><i className={item.icon}></i> {item.text}</a>
                ))
            }
        </div>

    )
}

export default TopBar