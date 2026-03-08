import React from 'react'
import '../../../styles.scss'

function Sidebar() {
  return (
    <>
        <div className="sidebar">
            <div className="sidebarItems">
                <div>
                    <button>
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
                <div>
                    <a href="/SKNext">
                        <img src="/ตราเสมา.png" alt="เสมาpic" width={'15%'} height={'15%'}/>
                        <p>SKNext</p>
                    </a>
                </div>
                <div>
                    <a href="/classroom">
                        <i class="fa-solid fa-users"></i>
                        <p>ห้องเรียน</p>
                    </a>
                </div>
                <div>
                    <a href="/news">
                        <i class="fa-solid fa-newspaper"></i>
                        <p>ข่าวสาร</p>
                    </a>    
                </div>
                <div>
                    <a href="/search">
                        <i class="fa-solid fa-search"></i>
                        <p>ค้นหา</p>
                    </a>
                </div>
                <div>
                    <a href="/profile">
                        <i class="fa-solid fa-user"></i>
                        <p>บัญชีผู้ใช้</p>
                    </a>
                </div>
            </div>

            <div className="sidebarItems" style={{marginTop: '5rem'}}>
                <div>
                    <a href="/search">
                        <i class="fa-solid fa-language"></i>
                        <p>english</p>
                    </a>
                </div>
                <div>
                    <a href="/services">
                        <i class="fa-regular fa-moon"></i>
                        <p>โหมดมืด</p>
                    </a>
                </div>
                <div>
                    <a href="/profile">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <p>ออกจากระบบ</p>
                    </a>
                </div>                
            </div>
        </div>
    </>
  )
}

export default Sidebar