import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function SearchDocuments() {
  return (
    <>
            <div className="SKNextHeader">
                <a href="/SKNext">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
                <h1>ค้นหาเอกสาร</h1>
            </div>

            <div className="searchContainer">
                <div className='SearchStudents'>
                    <div className="searchHeader">
                        <i class="fa-solid fa-file"></i>
                        <h2>ค้นหาเอกสาร</h2>
                    </div>

                    <div className="searchForm">
                        <p>เพิ่มตัวกรองการค้นหาเพื่อจำกัดผลการค้นหาของคุณ
ใส่ข้อมูลแค่ช่องที่คุณต้องการเท่านั้น ไม่จำเป็นต้องใส่ทุกช่อง</p>
                            <div className="SearchFormItem">
                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ค้นหาเรื่อง'/>
                                    <p>ป้อนเรื่องของเอกสารบางส่วนหรือทั้งหมด</p>
                                </div>

                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ค้นหาที่เรียนถึง'/>
                                    <p>ป้อนชื่อผู้ที่เอกสารเรียนถึงบางส่วนหรือทั้งหมด</p>
                                </div>

                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="date" id='name' placeholder='วันออกเอกสาร'/>
                                    <p>เลือกวัน/เดือน/ปีที่เอกสารออก</p>
                                </div>

                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ค้นหารหัสเอกสาร'/>
                                    <p>ป้อนรหัสเอกสาร</p>
                                </div>

                            </div>

                            <div className="SearchFormButton">
                                <button><i class="fa-solid fa-magnifying-glass"></i> ค้นหา</button>
                                <button><i class="fa-solid fa-rotate-right"></i> รีเซ็ต</button>
                            </div>
                        </div>
                    </div>
            </div>     
    </>
  )
}

export default SearchDocuments