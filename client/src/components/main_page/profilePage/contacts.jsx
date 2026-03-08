import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function Contacts() {
  return (
    <>
        <div className="contactInfo">
            <div className="contactInfoItems">
                <button>เพิ่มช่องทางติดต่อ</button>
                <p>ผู้คนในโรงเรียนจะสามารถค้นข้อมูลการติดต่อของคุณได้ผ่าน SKNext ค้นหา โปรดทราบว่าทุกคนจะสามารถเห็นข้อมูลของคุณได้ ยกเว้นข้อมูลที่คุณเลือกเป็นส่วนตัว</p>
            </div>
        </div>
    </>
  )
}

export default Contacts