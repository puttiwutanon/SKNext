import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function CheerPracticeCheck() {
  return (
    <>
        <div className='SKNextPageContainer'>
            <Sidebar />
            <div className='PageItems' style={{width: '100%'}}>
                <div className="SKNextHeader">
                    <a href="/SKNext">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                    <h1>การเช็กชื่อซ้อมเชียร์</h1>
                </div>

                <div className="CheerPracticeCheckContainer">
                    <div className='CheerPracticeCheck'>
                        <div className="CheerPracticeCheckHeader">
                            <button><i class="fa-solid fa-flag"></i> เริ่ม</button>
                            <button><i class="fa-solid fa-door-open"></i> เลิก</button>
                        </div>

                        <div className="CheerPracticeCheckBody">
                            <ul>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CheerPracticeCheck