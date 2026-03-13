import React, { useState } from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'
import TableReservationRow1 from './tableReservationRow-1';
import TableReservationRow3 from './tableReservationRow-3';
import TableReservationRow4 from './tableReservationRow-4';
import TableReservationRow5 from './tableReservationRow-5';
import TableReservationRow6 from './tableReservationRow-6';
import TableReservationRow2 from './tableReservationRow-2';

function TableReservation() {
    const [selectedTable, setSelectedTable] = useState(null);

    const handleReservation = async () => {
        if (!selectedTable) return;
        
        // Ready for backend — just fill in the API call later
        const reservationData = {
        tableCode: selectedTable,
        // Add more fields later: userId, date, timeSlot, etc.
        };

        console.log('Reservation data ready:', reservationData);

        // TODO: Uncomment and fill in when backend is ready
        // try {
        //   const response = await fetch('/api/reservations', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(reservationData),
        //   });
        //   const result = await response.json();
        //   console.log('Reservation successful:', result);
        // } catch (error) {
        //   console.error('Reservation failed:', error);
        // }
    };
  return (
    <>
        <div className='SKNextPageContainer'>
            <Sidebar />
            <div className='PageItems' style={{width: '100%'}}>
                <div className="SKNextHeader">
                    <a href="/SKNext">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                    <h1>การจองโต๊ะอาหารเวลาพักกลางวัน</h1>
                </div>
                <div className='table-reservation-wrapper' style={{
                    marginLeft: '1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start', // Change from center to flex-start
                    gap: '0.5rem',
                    width: '100%'
                }}>
                    <div className='teacherCanteen'>
                        <p>ห้องอาหารครู</p>
                    </div>
                    <div className='table-row-wrapper'>
                        <TableReservationRow6 selectedTable={selectedTable} onSelectTable={setSelectedTable} />
                        <TableReservationRow5 selectedTable={selectedTable} onSelectTable={setSelectedTable} />
                        <div className='tableDivider'></div>
                        <TableReservationRow4 selectedTable={selectedTable} onSelectTable={setSelectedTable} />
                        <TableReservationRow3 selectedTable={selectedTable} onSelectTable={setSelectedTable} />
                        <div className='tableDivider'></div>
                        <TableReservationRow2 selectedTable={selectedTable} onSelectTable={setSelectedTable} />
                        <TableReservationRow1 selectedTable={selectedTable} onSelectTable={setSelectedTable} />

                        <div className='restaurantBox' style={{width: '100%'}}>
                            <p>ร้านอาหาร</p>
                        </div>
                    </div>
                </div>

                <div className="tableReserveForm">
                    <h2>โต๊ะที่เลือก: {selectedTable ?? 'ยังไม่ได้เลือก'}</h2>
                    <button                         
                        onClick={handleReservation}
                        disabled={!selectedTable}
                    >
                        จองโต๊ะ
                    </button>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default TableReservation