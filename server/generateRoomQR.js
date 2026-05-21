const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
 
const BASE_URL = 'http://192.168.1.111:5173/roomReservation';
 
const rooms = ['R1', 'R2', 'R3', 'R4'];
 
async function generateWithLabel(roomCode) {
    const size = 400;
    const labelHeight = 50;
    const totalHeight = size + labelHeight;
 
    const qrDataUrl = await QRCode.toDataURL(`${BASE_URL}?room=${roomCode}`, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
    });
 
    const canvas = createCanvas(size, totalHeight);
    const ctx = canvas.getContext('2d');
 
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, totalHeight);
 
    const qrImage = await loadImage(qrDataUrl);
    ctx.drawImage(qrImage, 0, 0, size, size);
 
    // White square in center
    const boxSize = 80;
    const boxX = (size - boxSize) / 2;
    const boxY = (size - boxSize) / 2;
 
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
 
    // Center label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(roomCode, size / 2, size / 2);
 
    // Bottom label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${roomCode}`, size / 2, size + labelHeight / 2);
 
    const outputDir = path.join(__dirname, 'RoomQRcodes');
    fs.mkdirSync(outputDir, { recursive: true });
 
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, `room-${roomCode}.png`), buffer);
}
 
async function generateQR() {
    console.log(`Generating ${rooms.length} QR codes...\n`);
    for (const room of rooms) {
        await generateWithLabel(room);
        console.log(`✓ room-${room}.png`);
    }
    console.log(`\nDone! Saved to server/RoomQRcodes/`);
}
 
generateQR();