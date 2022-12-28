import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import Navbar from '@/components/Navbar'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'
import style from '@/styles/Loader.module.css'
import $ from 'jquery'
import 'datatables.net-dt'
import "datatables.net-buttons/js/buttons.colVis.js"
import "datatables.net-buttons/js/buttons.html5"
import 'datatables.net-dt/js/dataTables.dataTables'
import 'datatables.net-dt/css/jquery.dataTables.min.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
// import daterangepicker from 'daterangepicker'
// import 'daterangepicker/daterangepicker.css'

const Loader = () => {
    const [activeTab, setActiveTab] = useState(1)
    const [date, setDate] = useState((new Date()).toLocaleDateString('fr-CA'))
    const [isSubmit, setIsSubmit] = useState(true)
    const [listData, setListData] = useState({})
    const [listDataTC, setListDataTC] = useState({})
    const bahasa = useSelector(state => state.languageReducer.dictionary)
    const url = process.env.NEXT_PUBLIC_URL_API
    const itemTopBar = [
        {
            text: 'Cycle',
            icon: 'fi fi-rr-time-forward',
            id: 1
        },
        {
            text: 'Truck Count',
            icon: "fi fi-rr-ballot",
            id: 2
        },
    ]
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
            order: [[0, 'desc']]
        })
    }
    const getDataFromAPI = (date) => {
        $.ajax({
            url: `http://api5.${url}/cycle/loaderbyHourly?date=${date}&value=cycle`,
            method: 'GET',
            success: (data) => {
                setListData(data)
            },
            error: () => {
                alert(bahasa.cekkoneksi)
            }

        })
        $.ajax({
            url: `http://api5.${url}/cycle/loaderbyHourly?date=${date}&value=tc`,
            method: 'GET',
            success: (data) => {
                setListDataTC(data)
            },
            error: () => {
                alert(bahasa.cekkoneksi)
            }

        })
    }
    useEffect(() => {
        if (activeTab == 1) {
            setTimeout(() => {
                loadDataTable('#loadercycle')
                loadDataTable('#loadercycle2')
            },200)
        } else if (activeTab == 2) {
            loadDataTable('#loadertc')
            loadDataTable('#loadertc2')
        }
    }, [activeTab])
    useEffect(() => {
        getDataFromAPI(date)
    }, [activeTab, date, isSubmit])
    return (
        <div className={style.loaderbox}>
            <Head>
                <title>Loader Production</title>
                <meta name="description" content="Page Produksi berdasarkan Loader, Dashboard PPA." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Navbar />
                <TopBar listItem={itemTopBar} setActive={(param) => setActiveTab(param)} />
                {
                    activeTab == 1 ? (
                        <div className={style.tablebox}>
                            <h3><i className="fi fi-rr-clock-three"></i> Shift 1</h3>
                            <table id="loadercycle" className="tabelprod nocollapse">
                                <thead>
                                    <tr>
                                        <th>Loader</th>
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
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    listData && listData.shift_1 && listData.shift_1.length ? 
                                        listData.shift_1.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.loader}</td>
                                                <td>{item["06"]}</td>
                                                <td>{item["07"]}</td>
                                                <td>{item["08"]}</td>
                                                <td>{item["09"]}</td>
                                                <td>{item["10"]}</td>
                                                <td>{item["11"]}</td>
                                                <td>{item["12"]}</td>
                                                <td>{item["13"]}</td>
                                                <td>{item["14"]}</td>
                                                <td>{item["15"]}</td>
                                                <td>{item["16"]}</td>
                                                <td>{item["17"]}</td>
                                                <td>{item["total"]}</td>
                                            </tr>
                                        ))
                                         : ""
                                }
                                </tbody>
                            </table>
                            <h3><i className="fi fi-rr-clock-three"></i> Shift 2</h3>
                            <table id="loadercycle2" className="tabelprod nocollapse">
                                <thead>
                                    <tr>
                                        <th>Loader</th>
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
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    listData && listData.shift_2 && listData.shift_2.length ? 
                                        listData.shift_2.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.loader}</td>
                                                <td>{item["18"]}</td>
                                                <td>{item["19"]}</td>
                                                <td>{item["20"]}</td>
                                                <td>{item["21"]}</td>
                                                <td>{item["22"]}</td>
                                                <td>{item["23"]}</td>
                                                <td>{item["00"]}</td>
                                                <td>{item["01"]}</td>
                                                <td>{item["02"]}</td>
                                                <td>{item["03"]}</td>
                                                <td>{item["04"]}</td>
                                                <td>{item["05"]}</td>
                                                <td>{item["total"]}</td>
                                            </tr>
                                        )) : ""
                                }
                                </tbody>
                            </table>
                        </div>
                    ) : ''
                }
                {
                    activeTab == 2 ? (
                        <div className={style.tablebox}>
                            <h3><i className="fi fi-rr-clock-three"></i> Shift 1</h3>
                            <table id="loadertc" className="tabelprod nocollapse">
                                <thead>
                                    <tr>
                                        <th>Loader</th>
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
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                {
                                    listDataTC && listDataTC.shift_1 && listDataTC.shift_1.length ? (
                                        <tbody>
                                            {
                                                listDataTC.shift_1.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.loader}</td>
                                                        <td>{item["06"]}</td>
                                                        <td>{item["07"]}</td>
                                                        <td>{item["08"]}</td>
                                                        <td>{item["09"]}</td>
                                                        <td>{item["10"]}</td>
                                                        <td>{item["11"]}</td>
                                                        <td>{item["12"]}</td>
                                                        <td>{item["13"]}</td>
                                                        <td>{item["14"]}</td>
                                                        <td>{item["15"]}</td>
                                                        <td>{item["16"]}</td>
                                                        <td>{item["17"]}</td>
                                                        <td>{item["total"]}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="14">{bahasa.tidakada}</td>
                                            </tr>
                                        </tbody>
                                    )
                                }
                            </table>
                            <h3><i className="fi fi-rr-clock-three"></i> Shift 2</h3>
                            <table id="loadertc2" className="tabelprod nocollapse">
                                <thead>
                                    <tr>
                                        <th>Loader</th>
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
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                {
                                    listDataTC && listDataTC.shift_2 && listDataTC.shift_2.length ? (
                                        <tbody>
                                            {
                                                listDataTC.shift_2.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.loader}</td>
                                                        <td>{item["18"]}</td>
                                                        <td>{item["19"]}</td>
                                                        <td>{item["20"]}</td>
                                                        <td>{item["21"]}</td>
                                                        <td>{item["22"]}</td>
                                                        <td>{item["23"]}</td>
                                                        <td>{item["00"]}</td>
                                                        <td>{item["01"]}</td>
                                                        <td>{item["02"]}</td>
                                                        <td>{item["03"]}</td>
                                                        <td>{item["04"]}</td>
                                                        <td>{item["05"]}</td>
                                                        <td>{item["total"]}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    ) : ""
                                }
                            </table>
                        </div>
                    ) : ''
                }
            </div>
            <Footer />
        </div>
    )
}

export default Loader