import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'
import TableReservationRow1 from './tableReservationRow-1';
import TableReservationRow3 from './tableReservationRow-3';
import TableReservationRow4 from './tableReservationRow-4';
import TableReservationRow5 from './tableReservationRow-5';
import TableReservationRow6 from './tableReservationRow-6';
import TableReservationRow2 from './tableReservationRow-2';

function TableReservation() {
  return (
    <>
        <div className='SKNextPageContainer'>
            <Sidebar />
            <div className='PageItems'>
                <div className="SKNextHeader">
                    <a href="/SKNext">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                    <h1>การจองโต๊ะอาหารเวลาพักกลางวัน</h1>
                </div>
                <div style={{marginLeft: '1rem', marginBottom: '1rem'}}>
                    <div className='teacherCanteen'>
                        <p>ห้องอาหารครู</p>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <div style={{display: 'flex', height: '100vh', width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                            <p>ทางเดิน</p>
                        </div>
                        <TableReservationRow1/>
                        <TableReservationRow2/>
                        <div style={{marginRight: '1rem'}}></div>
                        <TableReservationRow3/>
                        <TableReservationRow4/>
                        <div style={{marginRight: '1rem'}}></div>
                        <TableReservationRow5/>
                        <TableReservationRow6/>
                    </div>
                </div>
                <div>
                    <h2>โต๊ะอาหารที่เลือก: </h2>
                </div>
            </div>
        </div>
    </>
  )
}

export default TableReservation