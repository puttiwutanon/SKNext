import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableRevervation() {
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
            </div>
        </div>
    </>
  )
}

export default TableRevervation