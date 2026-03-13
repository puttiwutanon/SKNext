import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function SearchStudents() {
  return (
    <>
            <div className="SKNextHeader">
                <a href="/SKNext">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
                <h1>ค้นหานักเรียน</h1>
            </div>

            <div className="searchContainer">
                <div className='SearchStudents'>
                    <div className="searchHeader">
                        <i class="fa-solid fa-child"></i>
                        <h2>ค้นหานักเรียน</h2>
                    </div>

                    <div className="searchForm">
                        <p>เพิ่มตัวกรองการค้นหาเพื่อจำกัดผลการค้นหาของคุณ
ใส่ข้อมูลแค่ช่องที่คุณต้องการเท่านั้น ไม่จำเป็นต้องใส่ทุกช่อง</p>
                            <div className="SearchFormItem">
                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ค้นหาด้วยชื่อจริง'/>
                                    <p>ป้อนชื่อจริงบางส่วนหรือทั้งหมด</p>
                                </div>

                                <div>
                                    <label htmlFor="nickname"></label>
                                    <input type="text" id='nickname' placeholder='ค้นหาด้วยชื่อเล่น'/>
                                    <p>ป้อนชื่อเล่นบางส่วนหรือทั้งหมด</p>
                                </div>

                                <div>
                                    <label htmlFor="grade"></label>
                                    <input type="text" id='grade' placeholder='ระดับชั้น'/>
                                </div>

                                <div>
                                    <label htmlFor="room"></label>
                                    <input type="text" id='room' placeholder='ห้อง'/>
                                </div>

                                <div>
                                    <label htmlFor="contact"></label>
                                    <input type="text" id='contact' placeholder='ช่องทางการติดต่อ'/>
                                    <p>ป้อนชื่อผู้ใช้ อีเมล เบอร์โทร หรือ URL ของนักเรียนอย่างครบถ้วน</p>
                                </div>

                                <div>
                                    <label htmlFor="studentId"></label>
                                    <input type="text" id='studentId' placeholder='รหัสประจำตัว'/>
                                    <p>ป้อนเลขประจำตัวนักเรียน 5 หลัก</p>
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

export default SearchStudents