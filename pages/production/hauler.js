import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
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
import daterangepicker from 'daterangepicker'
import 'daterangepicker/daterangepicker.css'

const Loader = ({ listDataLatest, listAllUnit}) => {
    const [activeTab, setActiveTab] = useState(1)
    const [showFilter, setShowFilter] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isSubmit, setSubmit] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState('')
    // mendapatkan kamus
    const bahasa = useSelector(state => state.languageReducer.dictionary)
    // handle submit
    const submitDate = (e) => {
        e.preventDefault()
        setStartDate(sessionStorage.getItem('start'))
        setEndDate(sessionStorage.getItem('end'))
        setSubmit(true)
    }
    // handle change unit
    const changeUnit = (e) => {
        setSelectedUnit(e.target.value)
    }
    const getDataHistory = (startDate, endDate, selectedUnit) => {
        $.ajax({
            url: `http://api5.ppa-mhu.net/cycle/findCnBetween?cn=${selectedUnit}&startDate=${startDate}&endDate=${endDate}`,
            method: 'GET',
            success: (data) => {
                console.log(data)
                if(data.data.length == 0){
                    alert(bahasa.tidakada)
                } else {
                    setShowFilter(false)
                }
            },
            error : () => {
                alert(bahasa.cekkoneksi)
            }
        })
    }
    // on submit change date
    useEffect(() => {
        if(isSubmit){
            if(activeTab == 2){
                // submit tanggal pada tab history
                getDataHistory(startDate, endDate, selectedUnit)
            } else {
                // submit tanggal pada tab cycle
            }
        }
        setSubmit(false)
    },[startDate, endDate, selectedUnit, isSubmit, activeTab])
    // setting datatable dan daterange
    useEffect(() => {
        if (activeTab == 1) {
            $('#payloadtable').DataTable({
                destroy: true,
                dom: 'lfBrtip',
                buttons: [{
                    text: '<i class="fi fi-rr-download"></i>',
                    extend: 'csvHtml5',
                    titleAttr: 'Download Excel'
                }, {
                    text: '<i class="fi fi-rr-settings-sliders"></i>',
                    extend: 'colvis',
                    titleAttr: 'Filter column'
                }],
                ordering: true,
            })
        } else {
            $('input[name="daterange"]').daterangepicker({
                opens: 'left'
            }, function (start, end) {
                sessionStorage.setItem('start', start.format('YYYY-MM-DD'))
                sessionStorage.setItem('end', end.format('YYYY-MM-DD'))
            })
        }
    }, [activeTab])
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
                    {
                        activeTab == 2 || activeTab == 3 ? (
                            <a onClick={() => setShowFilter(!showFilter)} title={bahasa.pilihperiode} className={style.filter}><i className="fi fi-rr-calendar"></i></a>
                        ) : ''
                    }
                    <div className={`${ showFilter ? style.activefilter : ''} ${style.filterbox}`}>
                        <form className={style.form} onSubmit={submitDate}>
                            <div className="section">
                                <label>{bahasa.pilihperiode}</label>
                                <input name="daterange" />
                            </div>
                            <div className="section">
                                <label>{bahasa.pilih} CN</label>
                                <input list="listunit" onChange={changeUnit}/>
                                <datalist id="listunit">
                                    {
                                        listAllUnit.length && listAllUnit.map(item => (
                                            <option value={item}>{item}</option>
                                        ))
                                    }
                                </datalist>
                            </div>
                            <div className="section">
                                <label onClick={() => setShowFilter(false)} className={style.closebtn}><i className="fi fi-rr-cross-small"></i></label>
                                <button type="submit"><i className="fi fi-rr-search"></i></button>
                            </div>
                        </form>
                    </div>
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
                                                            <td>{(item.eats + item.lats) / 2}</td>
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

export async function getStaticProps() {
    const res = await fetch('http://api5.ppa-mhu.net/cycle')
    const listData = await res.json()
    const resunit = await fetch('http://api5.ppa-mhu.net/cycle/cns')
    let listUnit = await resunit.json()
    listUnit = listUnit.data.filter(item => item != '')
    return {
        props: {
            listDataLatest: listData.data,
            listAllUnit : listUnit
        },
        revalidate: 60
    }
}

export default Loader