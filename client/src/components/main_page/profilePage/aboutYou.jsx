import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function AboutYou() {
  return (
    <>
        <div className="aboutYou">
            <div className="aboutYouItems">
                <div className="aboutYouHeader">
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                        <img src="/userpfp.png" alt="userpfp" width={'15%'} height={'15%'}/>
                        <div>
                            <h2>student name</h2>
                            <div>
                                <h4>student class</h4> 
                                <h4>student id</h4>            
                            </div>
                        </div>
                    </div>
                    <div>
                        <button><i class="fa-solid fa-arrow-right-from-bracket" style={{ color: 'rgb(255, 20, 62)' }}></i></button>
                        <button><i class="fa-solid fa-address-card" style={{ color: 'rgb(30, 48, 80)' }}></i></button>
                        <button>บันทึก</button>
                    </div>
                 </div>
                 <div className="aboutYouform">
                    <div className="aboutYouformItem">
                        <div>
                            <label htmlFor="name"></label>
                            <input type="text" id='name' placeholder='ชื่อเล่น'/>
                        </div>

                        <div>
                            <label htmlFor="name"></label>
                            <input type="text" id='name' placeholder='ช่อเล่นภาษาอังกฤษ'/>
                        </div>
                    </div>

                    <div className="aboutYouformItem">
                        <div>
                            <label htmlFor="name">วันเกิด</label>
                            <input type="date" id='name' placeholder='วันเกิด'/>
                        </div>

                        <div>
                        <label htmlFor="shirt-size">ไซส์เสื้อ</label>
                        <select id="shirt-size" className="custom-select">
                            <option value="">เลือกไซส์เสื้อ</option>
                            <option value="XS">XS (34 นิ้ว)</option>
                            <option value="S">S (36 นิ้ว)</option>
                            <option value="M">M (38 นิ้ว)</option>
                            <option value="L">L (40 นิ้ว)</option>
                            <option value="XL">XL (42 นิ้ว)</option>
                        </select>
                        </div>

                        <div>
                            <label htmlFor="name">ขนาดกางเกง</label>
                            <input type="text" id='name' placeholder='ขนาดกางเกง'/>
                        </div>

                        <div>
                            <label htmlFor="name"></label>
                            <input type="text" id='name' placeholder='ภูมิแพ้/อาหารที่แพ้'/>
                        </div>

                        <div>
                            <label htmlFor="name"></label>
                            <input type="text" id='name' placeholder='ปัญหาด้านสุขภาพ'/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
  )
}

export default AboutYou