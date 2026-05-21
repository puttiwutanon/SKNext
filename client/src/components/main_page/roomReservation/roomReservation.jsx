import React, { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../sidebar/sidebar';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/firebaseConfig';
import Rooms from './rooms';

const ROOMS_COLLECTION = 'InpireCommunityRooms';           // Firestore collection name
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
                <Rooms/>
            </div>

                <div className="roomReservationButtonWrapper">
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
        </div>
    </>
  )
}

export default RoomReservation