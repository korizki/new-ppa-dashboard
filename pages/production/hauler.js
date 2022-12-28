import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import style from '@/styles/ProdByLoader.module.css'
import $ from 'jquery'
import 'datatables.net-dt'
import "datatables.net-buttons/js/buttons.colVis.js"
import "datatables.net-buttons/js/buttons.html5"
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import daterangepicker from 'daterangepicker'
import 'daterangepicker/daterangepicker.css'

const Loader = ({ listDataLatest, listAllUnit }) => {
    const [activeTab, setActiveTab] = useState(1)
    const [showFilter, setShowFilter] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isSubmit, setSubmit] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState('')
    const [listHistory, setListHistory] = useState([])
    const [listCycleDate, setListCycleDate] = useState([])
    const [activeTabCycle, setActiveTabCycle] = useState(1)
    const [listDataByCycle, setListDataByCycle] = useState([])
    const [listDataByVolume, setListDataByVolume] = useState([])
    const [listDataByCount, setListDataByCount] = useState([])
    const [cycleType, setCycleType] = useState(1)
    // mendapatkan kamus
    const bahasa = useSelector(state => state.languageReducer.dictionary)
    const url = process.env.NEXT_PUBLIC_URL_API
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
    const loadDataToState = (data, dataType, activeTab) => {
        if (data.length == 0) {
            if(dataType == 'history' && activeTab == 2 || dataType == 'cycledate' && activeTab == 3){
                alert(bahasa.tidakada)
            }
        } else {
            setShowFilter(false)
            if (dataType == 'history') {
                // jka data tersedia, tampilkan
                setListHistory(data)
                setTimeout(() => {
                    loadDataTable('#historytable')
                }, 200)
            } else if (dataType == 'cycledate') {
                setListCycleDate(data)
                setActiveTabCycle(1)
            }
        }
    }
    const getDataHistory = (startDate, endDate, selectedUnit, activeTab) => {
        // get history
        $.ajax({
            url: `http://api5.${url}/cycle/findCnBetween?cn=${selectedUnit}&startDate=${startDate}&endDate=${endDate}`,
            method: 'GET',
            success: (data) => {
                loadDataToState(data.data, 'history', activeTab)
            },
            error: () => {
                alert(bahasa.cekkoneksi)
            }
        })
    }
    const getDataCycleDate = (startDate, endDate, activeTab) => {
        // data cycle by date range
        $.ajax({
            url: `http://api5.${url}/cycle/countCnDateBetween?startDate=${startDate}&endDate=${endDate}`,
            method: 'GET',
            success: (data) => {
                loadDataToState(data.data, 'cycledate', activeTab)
            },
            error: () => {
                alert(bahasa.cekkoneksi)
            }
        })
        // data cycle hourly by cycle
        $.ajax({
            url: `http://api5.${url}/cycle/countHourly?date=${startDate}&value=cycle`,
            method: 'GET',
            success: (data) => {
                setListDataByCycle(data)
            }
        })
        // data cycle by volume
        $.ajax({
            url: `http://api5.${url}/cycle/countHourly?date=${startDate}&value=volume`,
            method: 'GET',
            success: (data) => {
                setListDataByVolume(data)
            }    
        })
        // data cycle by tc
        $.ajax({
            url: `http://api5.${url}/cycle/countHourly?date=${startDate}&value=tc`,
            method: 'GET',
            success: (data) => {
                setListDataByCount(data)
            }    
        })
    }
    // load datatable tab latest
    const loadDataTable = (table) => {
        $(`${table}`).DataTable({
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
            order: [[1, 'desc']]
        })
    }
    // on submit change date
    useEffect(() => {
        if (isSubmit) {
            // submit tanggal pada tab history
            getDataHistory(startDate, endDate, selectedUnit, activeTab)
            // submit tanggal pada tab cycle
            getDataCycleDate(startDate, endDate, activeTab)
        }
        setSubmit(false)
    }, [startDate, endDate, selectedUnit, isSubmit, activeTab])
    // setting datatable dan daterange
    useEffect(() => {
        if (activeTab == 1) {
            loadDataTable('#payloadtable')
        } else {
            $('input[name="daterange"]').daterangepicker({
                opens: 'left'
            }, function (start, end) {
                sessionStorage.setItem('start', start.format('YYYY-MM-DD'))
                sessionStorage.setItem('end', end.format('YYYY-MM-DD'))
            })
            if (activeTab == 2) {
                listHistory.length && loadDataTable('#historytable')
            } else {
                setActiveTabCycle(1)
            }
        }
    }, [activeTab, listHistory])
    // on change active tab cycle
    useEffect(() => {
        if(activeTab == 3 && activeTabCycle == 1){
            setTimeout(() => {
                listCycleDate.length && loadDataTable('#cyclebydate')
            }, 200)
        } else if(activeTab == 3 && activeTabCycle == 2) {
            if(cycleType == 1){
                loadDataTable('#cyclehourcycle')
                loadDataTable('#cyclehourcycle2')
            } else if(cycleType == 2 ){
                loadDataTable('#cyclehourvolume')
                loadDataTable('#cyclehourvolume2')
            } else if(cycleType == 3){
                loadDataTable('#cyclehourcount')
                loadDataTable('#cyclehourcount2')
            }
        }
    },[activeTab, activeTabCycle, listCycleDate, cycleType])
    return (
        <div className={style.outerpayload}>
            <Head>
                <title>Hauler Production</title>
                <meta name="description" content="Page Produksi berdasarkan Hauler, Dashboard PPA." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Navbar />
                <div className={style.content}>
                    <div className={style.activenav}>
                        <div>
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
                            // konten tab cycle
                            activeTab == 3 ? (
                                <div>
                                    <a
                                        className={activeTabCycle == 1 ? style.active : ''}
                                        onClick={() => setActiveTabCycle(1)}
                                    ><i className="fi fi-rr-calendar-lines"></i> By Date</a>
                                    <a
                                        className={activeTabCycle == 2 ? style.active : ''}
                                        onClick={() => setActiveTabCycle(2)}
                                    ><i className="fi fi-rr-alarm-clock"></i> By Hourly</a>
                                </div>
                            ) : ''
                        }
                        {
                            activeTab == 3 && activeTabCycle == 2 ? (
                                <div>
                                    <a
                                        className={cycleType == 1 ? style.active : ''}
                                        onClick={() => setCycleType(1)}
                                    > Cycle</a>
                                    <a
                                        className={cycleType == 2 ? style.active : ''}
                                        onClick={() => setCycleType(2)}
                                    > Volume</a>
                                    <a
                                        className={cycleType == 3 ? style.active : ''}
                                        onClick={() => setCycleType(3)}
                                    > Count</a>
                                </div>
                            ) : ''
                        }
                    </div>
                    {
                        activeTab == 2 || activeTab == 3 ? (
                            <a onClick={() => setShowFilter(!showFilter)} title={bahasa.pilihperiode} className={style.filter}><i className="fi fi-rr-calendar"></i></a>
                        ) : ''
                    }
                    {
                        startDate ? (
                            <p className={style.info}><i className="fi fi-rr-info"></i> {bahasa.infoperiode} <strong>{startDate} - {endDate}</strong></p>
                        ) : ""
                    }
                    <div className={`${showFilter ? style.activefilter : ''} ${style.filterbox}`}>
                        <form className={style.form} onSubmit={submitDate}>
                            <div className="section">
                                <label>{bahasa.pilihperiode}</label>
                                <input name="daterange" />
                            </div>
                            <div className="section">
                                <label>{bahasa.pilih} CN</label>
                                <input list="listunit" onChange={changeUnit} />
                                <datalist id="listunit">
                                    {
                                        listAllUnit.length && listAllUnit.map((item, index) => (
                                            <option value={item} key={index}>{item}</option>
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
                                    <table id="payloadtable" className="tabelprod">
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
                        }{
                            // konten tab history
                            activeTab == 2 ? (
                                <div className={style.tablebox}>
                                    <table id="historytable" className="tabelprod">
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
                                            listHistory.length ? (
                                                <tbody>
                                                    {listHistory.map((item, index) => (
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
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="18">{bahasa.tidakada}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        }
                                    </table>
                                </div>
                            ) : ''
                        }
                        
                        {
                            activeTab == 3 && activeTabCycle == 1 ? (
                                <div className={style.tablebox}>
                                    <table id="cyclebydate" className="tabelprod">
                                        <thead>
                                            <tr>
                                                <th>CN</th>
                                                <th>Cycle</th>
                                                <th>PLD (Ton)</th>
                                                <th>Speed</th>
                                                <th>EST (Min)</th>
                                                <th>ES (Km/h)</th>
                                                <th>LS (Km/h)</th>
                                                <th>LDT (Min)</th>
                                                <th>EDT (Min)</th>
                                                <th>LST (Min)</th>
                                                <th>LT (Min)</th>
                                                <th>EDD (Km)</th>
                                                <th>LDD (Km)</th>
                                                <th>DT (Min)</th>
                                                <th>LMTS (Km/h)</th>
                                                <th>EMTS (Km/h)</th>
                                            </tr>
                                        </thead>
                                        {
                                            listCycleDate.length ? (
                                                <tbody>
                                                    {listCycleDate.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.cn}</td>
                                                            <td>{item.cycle}</td>
                                                            <td>{parseFloat(item.pld).toFixed(2)}</td>
                                                            <td>{((parseFloat(item.eats) + parseFloat(item.lats)) / 2).toFixed(2)}</td>
                                                            <td>{parseFloat(item.est).toFixed(2)}</td>
                                                            <td>{parseFloat(item.eats).toFixed(2)}</td>
                                                            <td>{parseFloat(item.lats).toFixed(2)}</td>
                                                            <td>{parseFloat(item.ltt).toFixed(2)}</td>
                                                            <td>{parseFloat(item.ett).toFixed(2)}</td>
                                                            <td>{parseFloat(item.lst).toFixed(2)}</td>
                                                            <td>{parseFloat(item.lt).toFixed(2)}</td>
                                                            <td>{parseFloat(item.etd).toFixed(2)}</td>
                                                            <td>{parseFloat(item.ltd).toFixed(2)}</td>
                                                            <td>{parseFloat(item.dt).toFixed(2)}</td>
                                                            <td>{parseFloat(item.lmts).toFixed(2)}</td>
                                                            <td>{parseFloat(item.emts).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="18">{bahasa.tidakada}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        }
                                    </table>
                                </div>
                            ) : ''
                        }
                        {
                            // cycle hourly by cycle
                            activeTab == 3 && activeTabCycle == 2 && cycleType == 1 ? (
                                <div className={style.cyclebox}>
                                    <h3>Shift 1</h3>
                                    {
                                        listDataByCycle ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourcycle" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>06</th>
                                                            <th>07</th>
                                                            <th>08</th>
                                                            <th>09</th>
                                                            <th>10</th>
                                                            <th>11</th>
                                                            <th>12</th>
                                                            <th>13</th>
                                                            <th>14</th>
                                                            <th>15</th>
                                                            <th>16</th>
                                                            <th>17</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByCycle.shift1 && listDataByCycle.shift1.length && listDataByCycle.shift1.map((cycle,index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["06"]}</td>
                                                                    <td>{cycle["07"]}</td>
                                                                    <td>{cycle["08"]}</td>
                                                                    <td>{cycle["09"]}</td>
                                                                    <td>{cycle["10"]}</td>
                                                                    <td>{cycle["11"]}</td>
                                                                    <td>{cycle["12"]}</td>
                                                                    <td>{cycle["13"]}</td>
                                                                    <td>{cycle["14"]}</td>
                                                                    <td>{cycle["15"]}</td>
                                                                    <td>{cycle["16"]}</td>
                                                                    <td>{cycle["17"]}</td>
                                                                    <td>{cycle["total"]}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
                                    <h3>Shift 2</h3>
                                    {
                                        listDataByCycle ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourcycle2" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>18</th>
                                                            <th>19</th>
                                                            <th>20</th>
                                                            <th>21</th>
                                                            <th>22</th>
                                                            <th>23</th>
                                                            <th>00</th>
                                                            <th>01</th>
                                                            <th>02</th>
                                                            <th>03</th>
                                                            <th>04</th>
                                                            <th>05</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByCycle.shift2 && listDataByCycle.shift2.length && listDataByCycle.shift2.map((cycle, index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["18"]}</td>
                                                                    <td>{cycle["19"]}</td>
                                                                    <td>{cycle["20"]}</td>
                                                                    <td>{cycle["21"]}</td>
                                                                    <td>{cycle["22"]}</td>
                                                                    <td>{cycle["23"]}</td>
                                                                    <td>{cycle["00"]}</td>
                                                                    <td>{cycle["01"]}</td>
                                                                    <td>{cycle["02"]}</td>
                                                                    <td>{cycle["03"]}</td>
                                                                    <td>{cycle["04"]}</td>
                                                                    <td>{cycle["05"]}</td>
                                                                    <td>{cycle["total"]}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            ) : ''
                        }
                        {
                            // cycle hourly by volume
                            activeTab == 3 && activeTabCycle == 2 && cycleType == 2 ? (
                                <div className={style.cyclebox}>
                                    <h3>Shift 1</h3>
                                    {
                                        listDataByVolume ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourvolume" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>06</th>
                                                            <th>07</th>
                                                            <th>08</th>
                                                            <th>09</th>
                                                            <th>10</th>
                                                            <th>11</th>
                                                            <th>12</th>
                                                            <th>13</th>
                                                            <th>14</th>
                                                            <th>15</th>
                                                            <th>16</th>
                                                            <th>17</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByVolume.shift1 && listDataByVolume.shift1.length && listDataByVolume.shift1.map((cycle,index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["06"]}</td>
                                                                    <td>{cycle["07"]}</td>
                                                                    <td>{cycle["08"]}</td>
                                                                    <td>{cycle["09"]}</td>
                                                                    <td>{cycle["10"]}</td>
                                                                    <td>{cycle["11"]}</td>
                                                                    <td>{cycle["12"]}</td>
                                                                    <td>{cycle["13"]}</td>
                                                                    <td>{cycle["14"]}</td>
                                                                    <td>{cycle["15"]}</td>
                                                                    <td>{cycle["16"]}</td>
                                                                    <td>{cycle["17"]}</td>
                                                                    <td>{parseFloat(cycle["total"]).toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
                                    <h3>Shift 2</h3>
                                    {
                                        listDataByVolume ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourvolume2" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>18</th>
                                                            <th>19</th>
                                                            <th>20</th>
                                                            <th>21</th>
                                                            <th>22</th>
                                                            <th>23</th>
                                                            <th>00</th>
                                                            <th>01</th>
                                                            <th>02</th>
                                                            <th>03</th>
                                                            <th>04</th>
                                                            <th>05</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByVolume.shift2 && listDataByVolume.shift2.length && listDataByVolume.shift2.map((cycle, index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["18"]}</td>
                                                                    <td>{cycle["19"]}</td>
                                                                    <td>{cycle["20"]}</td>
                                                                    <td>{cycle["21"]}</td>
                                                                    <td>{cycle["22"]}</td>
                                                                    <td>{cycle["23"]}</td>
                                                                    <td>{cycle["00"]}</td>
                                                                    <td>{cycle["01"]}</td>
                                                                    <td>{cycle["02"]}</td>
                                                                    <td>{cycle["03"]}</td>
                                                                    <td>{cycle["04"]}</td>
                                                                    <td>{cycle["05"]}</td>
                                                                    <td>{parseFloat(cycle["total"]).toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
                                </div>
                            ) : ''
                        }
                        {
                            // cycle hourly by count
                            activeTab == 3 && activeTabCycle == 2 && cycleType == 3 ? (
                                <div className={style.cyclebox}>
                                    <h3>Shift 1</h3>
                                    {
                                        listDataByCount ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourcount" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>06</th>
                                                            <th>07</th>
                                                            <th>08</th>
                                                            <th>09</th>
                                                            <th>10</th>
                                                            <th>11</th>
                                                            <th>12</th>
                                                            <th>13</th>
                                                            <th>14</th>
                                                            <th>15</th>
                                                            <th>16</th>
                                                            <th>17</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByCount.shift1 && listDataByCount.shift1.length && listDataByCount.shift1.map((cycle,index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["06"]}</td>
                                                                    <td>{cycle["07"]}</td>
                                                                    <td>{cycle["08"]}</td>
                                                                    <td>{cycle["09"]}</td>
                                                                    <td>{cycle["10"]}</td>
                                                                    <td>{cycle["11"]}</td>
                                                                    <td>{cycle["12"]}</td>
                                                                    <td>{cycle["13"]}</td>
                                                                    <td>{cycle["14"]}</td>
                                                                    <td>{cycle["15"]}</td>
                                                                    <td>{cycle["16"]}</td>
                                                                    <td>{cycle["17"]}</td>
                                                                    <td>{parseFloat(cycle["total"]).toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
                                    <h3>Shift 2</h3>
                                    {
                                        listDataByCount ? (
                                            <div className={style.tablebox}>
                                                <table id="cyclehourcount2" className="tabelprod">
                                                    <thead>
                                                        <tr>
                                                            <th>CN</th>
                                                            <th>18</th>
                                                            <th>19</th>
                                                            <th>20</th>
                                                            <th>21</th>
                                                            <th>22</th>
                                                            <th>23</th>
                                                            <th>00</th>
                                                            <th>01</th>
                                                            <th>02</th>
                                                            <th>03</th>
                                                            <th>04</th>
                                                            <th>05</th>
                                                            <th>TOTAL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listDataByCount.shift2 && listDataByCount.shift2.length && listDataByCount.shift2.map((cycle, index) => (
                                                                <tr key={index}>
                                                                    <td>{cycle.cn}</td>
                                                                    <td>{cycle["18"]}</td>
                                                                    <td>{cycle["19"]}</td>
                                                                    <td>{cycle["20"]}</td>
                                                                    <td>{cycle["21"]}</td>
                                                                    <td>{cycle["22"]}</td>
                                                                    <td>{cycle["23"]}</td>
                                                                    <td>{cycle["00"]}</td>
                                                                    <td>{cycle["01"]}</td>
                                                                    <td>{cycle["02"]}</td>
                                                                    <td>{cycle["03"]}</td>
                                                                    <td>{cycle["04"]}</td>
                                                                    <td>{cycle["05"]}</td>
                                                                    <td>{parseFloat(cycle["total"]).toLocaleString('id-ID')}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : ''
                                    }
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
            listAllUnit: listUnit
        },
        revalidate: 60
    }
}

export default Loader