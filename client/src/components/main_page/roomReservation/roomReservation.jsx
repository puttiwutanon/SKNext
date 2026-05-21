import React, { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../sidebar/sidebar';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebaseConfig';
import Rooms from './rooms';

const ROOMS_COLLECTION = 'InspireCommunityRooms';           // Firestore collection name
const QR_PARAM = 'room';                    // URL param in QR codes: ?room=R1
const OCCUPIED_DURATION_MS = 60 * 60 * 1000; // 1 hour per booking
const COUNTDOWN_SECONDS = 600; // 10 minutes to confirm booking

function RoomReservation() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [pendingRoom, setPendingRoom] = useState(null);
    const [showQRPopup, setShowQRPopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [dbRooms, setDBRooms] = useState({});
    const [, setTick] = useState(0);

    const timerRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animFrameRef = useRef(null);
    const jsQRRef = useRef(null);
    const pendingRoomRef = useRef(null);

    // ── Load jsQR dynamically ──────────────────────────────────────
    useEffect(() => {
        if (window.jsQR) { jsQRRef.current = window.jsQR; return; }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
        script.onload = () => { jsQRRef.current = window.jsQR; };
        document.head.appendChild(script);
    }, []);

    // Keep ref in sync so scanFrame closure can read latest pendingRoom
    useEffect(() => {
        pendingRoomRef.current = pendingRoom;
    }, [pendingRoom]);

    // ── Countdown ─────────────────────────────────────────────────
    const startConfirmationCountdown = () => {
        clearInterval(timerRef.current);
        setTimeLeft(COUNTDOWN_SECONDS);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setPendingRoom(null);
                    setTimeLeft(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // ── Camera + QR scan loop ──────────────────────────────────────
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
            if (code) { handleQRSuccess(code.data); return; }
        }
        animFrameRef.current = requestAnimationFrame(scanFrame);
    }, []);

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
        } catch {
            setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง');
        }
    }, []);

    const stopCamera = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (showQRPopup) { startCamera(); } else { stopCamera(); }
        return () => stopCamera();
    }, [showQRPopup]);

    useEffect(() => {
        return () => { clearInterval(timerRef.current); stopCamera(); };
    }, []);

    // ── Firestore: listen to rooms collection ──────────────────────
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, ROOMS_COLLECTION), (snapshot) => {
            const roomMap = {};
            snapshot.docs.forEach(docSnap => {
                const data = docSnap.data();
                roomMap[docSnap.id] = data;

                // Auto-expire occupied rooms
                if (data.status === 'occupied' && data.occupiedUntil) {
                    const expiry = data.occupiedUntil.toDate();
                    if (expiry < new Date()) {
                        updateDoc(docSnap.ref, {
                            status: 'available',
                            reservedBy: null,
                            timerStartsAt: null,
                            occupiedUntil: null,
                        });
                    }
                }
            });
            setDBRooms(roomMap);
        });
        return () => unsubscribe();
    }, []);

    // ── Restore state on reload ────────────────────────────────────
    useEffect(() => {
        if (!auth.currentUser || Object.keys(dbRooms).length === 0) return;

        const myRoom = Object.entries(dbRooms).find(
            ([, data]) => data.reservedBy === auth.currentUser.uid &&
                          (data.status === 'occupied' || data.status === 'pending')
        );

        if (myRoom && !selectedRoom) {
            setSelectedRoom(myRoom[0]);
            if (myRoom[1].status === 'pending') {
                setPendingRoom(myRoom[0]);
                const elapsed = Math.floor((Date.now() - myRoom[1].timerStartsAt.toDate()) / 1000);
                const remaining = COUNTDOWN_SECONDS - elapsed;
                if (remaining > 0) {
                    setTimeLeft(remaining);
                    startConfirmationCountdown();
                }
            }
        }
    }, [dbRooms]);

    // Tick every second so occupied-until timers re-render
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // ── Handlers ───────────────────────────────────────────────────
    const handleSelectRoom = (code) => {
        const myActiveRoom = Object.entries(dbRooms).find(
            ([, data]) => data.reservedBy === auth.currentUser?.uid &&
                          (data.status === 'occupied' || data.status === 'pending')
        );
        if (myActiveRoom) {
            const statusText = myActiveRoom[1].status === 'occupied' ? 'กำลังใช้งานอยู่' : 'รอการยืนยันอยู่';
            alert(`คุณมีห้อง ${myActiveRoom[0]} ที่${statusText} กรุณายกเลิกก่อน`);
            return;
        }
        setSelectedRoom(code);
    };

    const handleReservation = async () => {
        if (!selectedRoom || !auth.currentUser) return;

        const alreadyReserved = Object.values(dbRooms).some(
            r => r.reservedBy === auth.currentUser.uid &&
                 (r.status === 'pending' || r.status === 'occupied')
        );
        if (alreadyReserved) {
            alert('คุณมีการจองห้องอยู่แล้ว กรุณายกเลิกก่อนจองใหม่');
            return;
        }

        try {
            await updateDoc(doc(db, ROOMS_COLLECTION, selectedRoom), {
                status: 'pending',
                reservedBy: auth.currentUser.uid,
                timerStartsAt: new Date(),
            });
            setPendingRoom(selectedRoom);
            startConfirmationCountdown();
        } catch (err) {
            console.error('Error reserving room:', err);
        }
    };

    const handleConfirm = () => {
        if (!selectedRoom) return;
        setShowQRPopup(true);
        startConfirmationCountdown();
    };

    const handleCancel = async () => {
        const roomToCancel = pendingRoom || selectedRoom;
        if (!roomToCancel) return;

        const roomData = dbRooms[roomToCancel];
        if (!roomData || (roomData.status !== 'pending' && roomData.status !== 'occupied')) return;

        try {
            await updateDoc(doc(db, ROOMS_COLLECTION, roomToCancel), {
                status: 'available',
                reservedBy: null,
                timerStartsAt: null,
                occupiedUntil: null,
            });
            setPendingRoom(null);
            setSelectedRoom(null);
            setTimeLeft(null);
            clearInterval(timerRef.current);
        } catch (err) {
            console.error('Error canceling room:', err);
        }
    };

    const handleQRSuccess = async (data) => {
        const url = new URL(data);
        const scannedRoomCode = url.searchParams.get(QR_PARAM); // ?room=R1
        const currentPending = pendingRoomRef.current;

        if (scannedRoomCode === currentPending) {
            const occupiedUntil = new Date(Date.now() + OCCUPIED_DURATION_MS);
            await updateDoc(doc(db, ROOMS_COLLECTION, currentPending), {
                status: 'occupied',
                occupiedUntil,
            });
            stopCamera();
            setScannedData('Success!');
            setPendingRoom(null);
            setTimeLeft(null);
            clearInterval(timerRef.current);
            setTimeout(() => setShowQRPopup(false), 1500);
        } else {
            alert(`ผิดห้อง! คุณจองห้อง ${currentPending} แต่สแกนห้อง ${scannedRoomCode}`);
        }
    };

    const handleClosePopup = () => setShowQRPopup(false);

    const formatTime = (seconds) => {
        if (seconds === null) return '';
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

  return (
    <>
        <div className="SKNextPageContainer">
            <Sidebar />
            <div className="PageItems" style={{width: '100%'}}>
                <div className="SKNextHeader">
                    <a href="/SKNext">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                    <h1>การจองห้องใน Inspire Community</h1>
                </div>
                <Rooms selectedRoom={selectedRoom} onSelectRoom={handleSelectRoom} dbRooms={dbRooms}/>

                <div className="roomReservationButtonWrapper">
                    <div>
                        <h2>ห้องที่เลือก: {selectedRoom ?? 'ยังไม่ได้เลือก'}</h2>

                        <h2 style={{ display: pendingRoom && timeLeft !== null ? 'block' : 'none' }}>
                            ห้อง {pendingRoom} — กรุณายืนยันภายใน: {formatTime(timeLeft)}
                        </h2>

                        {(() => {
                            const roomData = dbRooms[selectedRoom];
                            if (!roomData || roomData.status !== 'occupied') return null;
                            const occupiedUntil = roomData.occupiedUntil?.toDate?.();
                            if (!occupiedUntil) return null;
                            const secondsLeft = Math.max(0, Math.floor((occupiedUntil - Date.now()) / 1000));
                            return <h2>ห้อง {selectedRoom} — สามารถใช้งานได้อีก: {formatTime(secondsLeft)}</h2>;
                        })()}

                    </div>

                    <div className="notes-1">
                        <h3>ระเบียบการใช้ศูนย์ Inspire Community:</h3>
                        <p>1) ศูนย์ Inspire Community เป็นศูนย์การเรียนรู้ที่ครู นักเรียน และบุคลากรทางการศึกษา โรงเรียนสวนกุหลาบวิทยาลัย นนทบุรี ทุกคน สามารถใช้บริการได้</p>
                        <p>2) ในวันทำการ ศูนย์ Inspire Community เปิดเวลา 08.30 น. และปิดเวลา 16.30 น. โดยครูสามารถนำนักเรียนมาใช้บริการที่ศูนย์การเรียนรู้ได้ โดยไม่เสียค่าบริการ สำหรับวันเสาร์ วันอาทิตย์ หรือวันหยุดนักขัตฤกษ์ เปิดตามความจำเป็น</p>
                        <p>3) โรงเรียนมอบให้งานอาคารสถานที่ฯ กลุ่มบริหารทั่วไป เป็นผู้ดูแลให้บริการ เปิด – ปิด ศูนย์การเรียนรู้</p>
                        <ul>
                            <p>4) ในกรณีที่ครูมีการจัดการเรียนการสอนพิเศษ แบบเก็บค่าบริการ ให้ดำเนินการ ดังนี้</p>
                            <li>&emsp;4.1) ดำเนินการจ่ายค่าบริการ ชั่วโมงละ 100 บาท / ห้อง ที่ห้องการเงิน อาคาร สธ.10 ชั้น 1</li>
                            <li>&emsp;4.2) นำหลักฐานการจ่ายค่าบริการที่ชำระเรียบร้อยแล้วที่ห้องการเงิน มาแสดงในวันขอเข้าใช้บริการ ให้กับหัวหน้างานอาคารฯ เพื่อดำเนินการเปิดห้อง</li>
                        </ul>
                        <p>5) ห้ามนำอาหาร ขนม เครื่องดื่ม (ยกเว้นน้ำดื่ม) มารับประทานในห้องเรียน</p>
                        <p>6) ไม่อนุญาตให้เคลื่อนย้าย โต๊ะ - เก้าอี้ ออกจากห้องเรียน</p>
                        <p>7) ห้ามนำสัตว์เลี้ยงทุกชนิดเข้ามาในห้องเรียน หากพบเห็นสุนัข หรือสัตว์อื่นเข้ามาในห้องเรียน ให้แจ้งแม่บ้านหรือเจ้าหน้าที่บริการประจำพื้นที่ ทันที</p>
                        <p>8) หากพบอุปกรณ์ภายในห้องเกิดการชำรุดเสียหาย ให้แจ้งหัวหน้างานอาคารสถานที่ฯ ทันที</p>
                        <p>9) หากไม่ปฏิบัติตามข้อกำหนดของการใช้ ศูนย์ Inspire Community ขอของให้งดให้บริการในครั้งต่อไป</p>
                        <h4>(โทร) 082-971-5142 ครูอุดม ทาเลิศ หัวหน้างานอาคารสถานที่ฯ กลุ่มบริหารทั่วไป</h4>
                    </div>

                    <div className="tableReservationButtons">
                        <div className="tableReserveForm">
                                <button                         
                                    onClick={handleReservation}
                                    disabled={!selectedRoom || !!pendingRoom}
                                >
                                    จองห้อง
                                </button>
                        </div>

                        <div className="tableReserveForm">
                            <button                         
                                onClick={handleConfirm}
                                disabled={!pendingRoom}
                            >
                                ยืนยันการจอง
                            </button>
                        </div>

                        <div className="tableReserveForm">
                            <button                         
                                    onClick={handleCancel}
                                    disabled={!pendingRoom && dbRooms[selectedRoom]?.status !== 'occupied'}
                            >
                                ยกเลิกการจอง
                            </button>
                        </div>

                        <div className="scanQRtoConfirm">

                        </div>
                    </div>
                    
                </div>
            </div>

        </div>

            {showQRPopup && (
                <div className="qr-popup-overlay" onClick={handleClosePopup}>
                    <div className="qr-popup" onClick={e => e.stopPropagation()}>
                        <button className="qr-popup-close" onClick={handleClosePopup}>✕</button>
 
                        <h2>สแกน QR Code เพื่อยืนยัน</h2>
                        <p>โต๊ะที่จอง: <strong>{pendingRoom}</strong></p>
 
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

export default RoomReservation