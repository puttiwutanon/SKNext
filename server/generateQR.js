const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://192.168.1.111:5173/tableRevervation';

const tables = []
const rows = ['A','B','C','D','E','F'];
for (let num = 1; num <= 24; num++) {
    for (const row of rows) {
        tables.push(`${num}${row}`);
    }
}

async function generateWithLabel(tableCode) {
    const size = 400;
    const labelHeight = 50;
    const totalHeight = size + labelHeight;
 
    // 1. Generate QR as a data URL
    const qrDataUrl = await QRCode.toDataURL(`${BASE_URL}?table=${tableCode}`, {
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
 
    const boxSize = 80;
    const boxX = (size - boxSize) / 2;
    const boxY = (size - boxSize) / 2;
 
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
 
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tableCode, size / 2, size / 2);
 
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${tableCode}`, size / 2, size + labelHeight / 2);

    const outputDir = path.join(__dirname, 'qrcodes');
    fs.mkdirSync(outputDir, { recursive: true });
 
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, `table-${tableCode}.png`), buffer);
}
 
async function generateQR() {
    console.log(`Generating ${tables.length} QR codes...\n`);
    for (const table of tables) {
        await generateWithLabel(table);
        console.log(`✓ table-${table}.png`);
    }
    console.log(`\nDone! Saved to server/qrcodes/`);
}

generateQR();