import {useState, useEffect} from 'react'
import Navbar from '@/components/Navbar'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'
import style from '@/styles/Loader.module.css'

const Loader = () => {
    const [activeTab, setActiveTab] = useState(1)
    const itemTopBar = [{
        text: 'Cycle'
    }]
    return (
        <div className={style.loaderbox}>
            <div>
                <Navbar />
                <TopBar lisItem={itemTopBar}/>
            </div>
            <Footer />
        </div>
    )
}

export default Loader