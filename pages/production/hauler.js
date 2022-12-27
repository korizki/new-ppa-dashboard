import Head from 'next/head'
import { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import style from '@/styles/ProdByLoader.module.css'
import idn from '@/lang/ind'
import en from '@/lang/en'
import $ from 'jquery'
import 'datatables.net-dt'
import "datatables.net-buttons/js/buttons.colVis.js"
import "datatables.net-buttons/js/buttons.html5"
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'

const Loader = ({listDataLatest}) => {
    const [activeTab, setActiveTab] = useState(1)
    const bahasa = useSelector(state => state.languageReducer.dictionary)
    useEffect(() => {
        activeTab == 1 && 
        $('#payloadtable').DataTable({
            destroy: true,
            dom: 'lfBrtip',
            buttons: [{
                text: '<i class="fi fi-rr-download"></i>',
                extend: 'csvHtml5',
                titleAttr: 'Download Excel'
            },{
                text: '<i class="fi fi-rr-settings-sliders"></i>',
                extend: 'colvis',
                titleAttr: 'Filter column'
            }],
            ordering: true,
        })
    },[activeTab])
    return (
        <div className={style.outerpayload}>
            <Head>
                <title>Production by Loader</title>
                <meta name="description" content="Page Produksi berdasarkan Loader, Dashboard PPA." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Navbar />
                <div className={style.content}>
                    <div className={style.activenav}>
                        <a
                            className={activeTab == 1 ? style.active : ''}
                            onClick={() => setActiveTab(1)}
                        ><i className="fi fi-rr-confetti"></i> Latest</a>
                        <a
                            className={activeTab == 2 ? style.active : ''}
                            onClick={() => setActiveTab(2)}
                        ><i className="fi fi-rr-time-past"></i>History</a>
                        <a
                            className={activeTab == 3 ? style.active : ''}
                            onClick={() => setActiveTab(3)}
                        ><i className="fi fi-rr-loading"></i> Cycle</a>
                    </div>
                    <a title="Pilih Periode" className={style.filter}><i className="fi fi-rr-calendar"></i></a>
                    <div>
                        {
                            // konten tab latest
                            activeTab == 1 ? (
                                <div className={style.tablebox}>
                                    <table id="payloadtable">
                                        <thead>
                                            <tr>
                                                <th>CN</th>
                                                <th>Date</th>
                                                <th>Loader</th>
                                                <th>PLD (Ton)</th>
                                                <th>Speed</th>
                                                <th>EDT (Min)</th>
                                                <th>EDD (Km)</th>
                                                <th>ES (Km/h)</th>
                                                <th>EST (Min)</th>
                                                <th>LT (Min)</th>
                                                <th>LDT (Min)</th>
                                                <th>LDD (Km)</th>
                                                <th>LS (Km/h)</th>
                                                <th>LST (Min)</th>
                                                <th>DT (Min)</th>
                                                <th>RSSI</th>
                                                <th>LMTS (Km/h)</th>
                                                <th>EMTS (Km/h)</th>
                                            </tr>
                                        </thead>
                                        {
                                            listDataLatest.length && (
                                                <tbody>
                                                    {listDataLatest.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.cn}</td>
                                                            <td>{item.created_date}</td>
                                                            <td>{item.loader}</td>
                                                            <td>{item.pld}</td>
                                                            <td>{(item.eats + item.lats)/2}</td>
                                                            <td>{item.ett}</td>
                                                            <td>{item.etd}</td>
                                                            <td>{item.eats}</td>
                                                            <td>{item.est}</td>
                                                            <td>{item.lt}</td>
                                                            <td>{item.ltt}</td>
                                                            <td>{item.ltd}</td>
                                                            <td>{item.lats}</td>
                                                            <td>{item.lst}</td>
                                                            <td>{item.dt}</td>
                                                            <td>{item.cwc}</td>
                                                            <td>{item.lmts}</td>
                                                            <td>{item.emts}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            )
                                        }
                                    </table>
                                </div>
                            ) : ''
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export async function getStaticProps(){
    const res = await fetch('http://api5.ppa-mhu.net/cycle')
    const listData = await res.json()
    return {
        props: {
            listDataLatest: listData.data
        },
        revalidate: 60
    }
}

export default Loader