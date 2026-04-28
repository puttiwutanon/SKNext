import React, { useState, useEffect, useRef, useCallback } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebaseConfig';
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
    const [pendingTable, setPendingTable] = useState(null);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [dbTables, setDBTables] = useState([]);
    const [, setTick] = useState(0);
 
    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);
    const jsQRRef = useRef(null);
    const pendingTableRef = useRef(null);
 
    // ── Load jsQR dynamically ──────────────────────────────────────
    useEffect(() => {
        if (window.jsQR) {
            jsQRRef.current = window.jsQR;
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
        script.onload = () => { jsQRRef.current = window.jsQR; };
        document.head.appendChild(script);
    }, []);
 
    const startConfirmationCountdown = () => {
        clearInterval(timerRef.current);
        setTimeLeft(600);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setPendingTable(null);
                    setTimeLeft(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
 
    // ── Camera + QR scan loop ──────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCameraError(null);
        setScannedData(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                requestAnimationFrame(scanFrame);
            }
        } catch (err) {
            setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง');
        }
    }, []);
 
    const scanFrame = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 
        if (jsQRRef.current) {
            const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });
            if (code) {
                handleQRSuccess(code.data);
                return; // stop loop after success
            }
        }
        animFrameRef.current = requestAnimationFrame(scanFrame);
    }, []);

    useEffect(() => {
        pendingTableRef.current = pendingTable;
    }, [pendingTable]);
 
    const stopCamera = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);
 
    // Start/stop camera with popup visibility
    useEffect(() => {
        if (showQRPopup) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [showQRPopup]);
 
    // Clean up on unmount
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            stopCamera();
        };
    }, []);
 
    const formatTime = (seconds) => {
        if (seconds === null) return '';
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };
 
    // ── Handlers ───────────────────────────────────────────────────
    const handleReservation = async () => {
        if (!selectedTable || !auth.currentUser) return;

        const tableRef = doc(db, 'tables', selectedTable);

        //เช็คว่านร.มีการจองโต๊ะยัง
        const alreadyReserved = Object.values(dbTables).some(
            table => table.reservedBy === auth.currentUser.uid && 
                    (table.status === 'pending' || table.status === 'occupied')
        );

        if (alreadyReserved) {
            alert('คุณมีการจองโต๊ะอยู่แล้ว กรุณายกเลิกก่อนจองใหม่');
            return;
        }
        
        try {
            await updateDoc(tableRef, {
                status: 'pending',
                reservedBy: auth.currentUser.uid,
                timerStartsAt: new Date()
            });
            
            setPendingTable(selectedTable);   
            startConfirmationCountdown();
        } catch (error) {
            console.error("Error reserving table: ", error);
        }
    };
 
    const handleConfirm = () => {
        if (!selectedTable) return;
        setShowQRPopup(true);
        startConfirmationCountdown();
    };

    const handleCancel = async () => {
        console.log("handleCancel fired", { pendingTable, selectedTable, tableToCancel: pendingTable || selectedTable });
        const tableToCancel = pendingTable || selectedTable;
        if (!tableToCancel) return;

        const tableData = dbTables[tableToCancel];
        if (!tableData || (tableData.status !== 'pending' && tableData.status !== 'occupied')) return;

        const tableRef = doc(db, 'tables', tableToCancel);

        try {
            await updateDoc(tableRef, {
                status: 'available',
                reservedBy: null,
                timerStartsAt: null,
                occupiedUntil: null,
            });

            setPendingTable(null);
            setSelectedTable(null);
            setTimeLeft(null);
            clearInterval(timerRef.current);
            
            console.log("Cancellation complete!");
        } catch (error) {
            console.error("Error canceling table: ", error);
        }
    };


 
    const handleQRSuccess = async (data) => {
        // Your URL: http://192.168.1.111:5173/tableRevervation?table=1A
        const url = new URL(data);
        const scannedTableCode = url.searchParams.get('table');
        const pendingTable = pendingTableRef.current;

        if (scannedTableCode === pendingTable) {
            const tableRef = doc(db, 'tables', pendingTable);
            const occupiedUntil = new Date(Date.now() + 1 * 60 * 1000);
            
            await updateDoc(tableRef, {
                status: 'occupied',
                occupiedUntil: occupiedUntil,
            });

            stopCamera();
            setScannedData("Success!");
            setPendingTable(null);
            setTimeLeft(null);
            clearInterval(timerRef.current);
            
            setTimeout(() => {
                setShowQRPopup(false);
            }, 1500);
        } else {
            alert(`ผิดโต๊ะ! คุณจองโต๊ะ ${pendingTable} แต่สแกนโต๊ะ ${scannedTableCode}`);
        }
    };

 
    const handleClosePopup = () => {
        setShowQRPopup(false);
    };

    const handleSelectTable = (code) => {
        // If user has an occupied table, don't allow selecting another
        const myOccupiedTable = Object.entries(dbTables).find(
            ([id, data]) => data.reservedBy === auth.currentUser?.uid && (data.status === 'occupied' || data.status === 'pending')
        );
        
        if (myOccupiedTable) {
            const statusText = myOccupiedTable[1].status === 'occupied' ? 'กำลังใช้งานอยู่' : 'รอการยืนยันอยู่';
            alert(`คุณมีโต๊ะ ${myOccupiedTable[0]} ที่${statusText} กรุณายกเลิกก่อน`);
            return;
        }
        
        setSelectedTable(code);
    };

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(()=>{
    const unsubscribe = onSnapshot(collection(db, 'tables'), (snapshot) => {
            const tableMap = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                tableMap[doc.id] = doc.data();

                if(data.status === 'occupied' && data.occupiedUntil) {
                    const expiry = data.occupiedUntil.toDate();
                    if(expiry < new Date()){
                        updateDoc(doc.ref, {
                            status: 'available',
                            reservedBy: null,
                            timerStartsAt: null,
                            occupiedUntil: null,
                        });
                    }
                }
            });
        setDBTables(tableMap);
    });
    return () => unsubscribe();        
    }, []);

    useEffect(() => {
        if (!auth.currentUser || Object.keys(dbTables).length === 0) return;
        
        const myOccupied = Object.entries(dbTables).find(
            ([id, data]) => data.reservedBy === auth.currentUser.uid && 
                            (data.status === 'occupied' || data.status === 'pending')
        );
        
        if (myOccupied && !selectedTable) {
            setSelectedTable(myOccupied[0]);
            if (myOccupied[1].status === 'pending') {
                setPendingTable(myOccupied[0]);
                // restore countdown from timerStartsAt
                const elapsed = Math.floor((Date.now() - myOccupied[1].timerStartsAt.toDate()) / 1000);
                const remaining = 600 - elapsed;
                if (remaining > 0) {
                    setTimeLeft(remaining);
                    startConfirmationCountdown();
                }
            }
        }
    }, [dbTables]);



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
                    alignItems: 'flex-start', 
                    gap: '0.5rem',
                    width: '100%'
                }}>
                    <div className='teacherCanteen'>
                        <p>ห้องอาหารครู</p>
                    </div>
                    <div className='table-row-wrapper'>
                        <TableReservationRow6 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables}/>
                        <TableReservationRow5 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables} />
                        <div className='tableDivider'></div>
                        <TableReservationRow4 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables} />
                        <TableReservationRow3 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables} />
                        <div className='tableDivider'></div>
                        <TableReservationRow2 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables} />
                        <TableReservationRow1 selectedTable={selectedTable} onSelectTable={handleSelectTable} dbTables={dbTables} />

                        <div className='restaurantBox' style={{width: '100%'}}>
                            <p>ร้านอาหาร</p>
                        </div>
                    </div>
                </div>

                <div className="notes-1">
                    <p>หมายเหตุ:</p>
                    <ul>
                        <li>-กรุณาเลือกโต๊ะที่ต้องการจองก่อนกดปุ่ม "จองโต๊ะ"</li>
                        <li>-กรุณาแสกน QR Code เพื่อยืนยันการจองภายในเวลา 10 นาที</li>
                        <li>-โต๊ะที่คุณจองนั้นสามารถใช่งานได้เป็นเวลา 30 นาที</li>
                    </ul>
                </div>

                <div className="tableReservationButtonWrapper">
                    <div>
                        <h2>โต๊ะที่เลือก: {selectedTable ?? 'ยังไม่ได้เลือก'}</h2>

                        <h2 style={{ display: pendingTable && timeLeft !== null ? 'block' : 'none' }}>
                            โต๊ะ {pendingTable} — กรุณายืนยันภายใน: {formatTime(timeLeft)}
                        </h2>

                        {(() => {
                            const tableData = dbTables[selectedTable];
                            if (!tableData || tableData.status !== 'occupied') return null;
                            const occupiedUntil = tableData.occupiedUntil?.toDate?.();
                            if (!occupiedUntil) return null;
                            const secondsLeft = Math.max(0, Math.floor((occupiedUntil - Date.now()) / 1000));
                            return <h2>โต๊ะ {selectedTable} — สามารถใช้งานได้อีก: {formatTime(secondsLeft)}</h2>;
                        })()}

                    </div>
                    <div className="tableReservationButtons">
                        <div className="tableReserveForm">
                                <button                         
                                    onClick={handleReservation}
                                    disabled={!selectedTable || !!pendingTable}
                                >
                                    จองโต๊ะ
                                </button>
                        </div>

                        <div className="tableReserveForm">
                            <button                         
                                onClick={handleConfirm}
                                disabled={!pendingTable}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>

                        <div className="tableReserveForm">
                            <button                         
                                    onClick={handleCancel}
                                    disabled={!pendingTable && dbTables[selectedTable]?.status !== 'occupied'}
                            >
                                ยกเลิกการจอง
                            </button>
                        </div>
                    </div>
                </div>

                <div className="scanQRtoConfirm">

                </div>
                <div>
                    
                </div>
            </div>
        </div>

            {showQRPopup && (
                <div className="qr-popup-overlay" onClick={handleClosePopup}>
                    <div className="qr-popup" onClick={e => e.stopPropagation()}>
                        <button className="qr-popup-close" onClick={handleClosePopup}>✕</button>
 
                        <h2>สแกน QR Code เพื่อยืนยัน</h2>
                        <p>โต๊ะที่จอง: <strong>{pendingTable}</strong></p>
 
                        {timeLeft !== null && !scannedData && (
                            <p className={`qr-countdown ${timeLeft <= 60 ? 'urgent' : ''}`}>
                                เวลาที่เหลือ: {formatTime(timeLeft)}
                            </p>
                        )}
 
                        {/* Camera viewport */}
                        <div className="qr-scanner-viewport">
                            {scannedData ? (
                                <div className="qr-success-state">
                                    <span className="qr-success-icon">✓</span>
                                    <p>สแกนสำเร็จ</p>
                                </div>
                            ) : cameraError ? (
                                <p className="qr-error">{cameraError}</p>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        className="qr-video"
                                        muted
                                        playsInline
                                    />
                                    {/* Hidden canvas for frame analysis */}
                                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    {/* Corner markers overlay */}
                                    <div className="qr-scanner-corner top-left" />
                                    <div className="qr-scanner-corner top-right" />
                                    <div className="qr-scanner-corner bottom-left" />
                                    <div className="qr-scanner-corner bottom-right" />
                                    <div className="qr-scan-line" />
                                    <p className="qr-hint">วางกล้องให้ตรง QR Code</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
    </>
  )
}

export default TableReservation