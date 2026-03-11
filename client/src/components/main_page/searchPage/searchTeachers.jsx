import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function SearchTeachers() {
  return (
    <>
            <div className="SKNextHeader">
                <a href="/SKNext">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
                <h1>ค้นหาครู</h1>
            </div>

            <div className="searchContainer">
                <div className='SearchStudents'>
                    <div className="searchHeader">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <h2>ค้นหาครู</h2>
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
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ค้นหาด้วยชื่อเล่น'/>
                                    <p>ป้อนชื่อเล่นบางส่วนหรือทั้งหมด</p>
                                </div>

                                <div>
                                    <label htmlFor="shirt-size"></label>
                                    <select id="shirt-size" className="custom-select">
                                        <option value="">กลุ่มสาระการเรียนรู้</option>
                                        <option value="">ภาษาไทย</option>
                                        <option value="">คณิตศาสตร์</option>
                                        <option value="">วิทยาศาสตร์และเทคโนโลยี</option>
                                        <option value="">สังคมศึกษา ศาสนาและวัฒนธรรม</option>
                                        <option value="">สุขศึกษาและพลศึกษา</option>
                                        <option value="">การงานอาชีพ</option>
                                        <option value="">ภาษาต่างประเทศ</option>
                                        <option value="">กิจกรรมพัฒนาผู้เรียน</option>
                                        <option value="">ศิลปะ</option>
                                    </select>
                                    <p>เลือกกลุ่มสาระการเรียนรู้ที่ครูสอน</p>
                                </div>

                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ห้อง'/>
                                    <p>ป้อนเลขห้อง 3 หลักของห้องที่ครูเป็นที่ปรึกษา</p>
                                </div>

                                <div>
                                    <label htmlFor="name"></label>
                                    <input type="text" id='name' placeholder='ช่องทางการติดต่อ'/>
                                    <p>ป้อนชื่อผู้ใช้ อีเมล เบอร์โทร หรือ URL ของนักเรียนอย่างครบถ้วน</p>
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

export default SearchTeachers