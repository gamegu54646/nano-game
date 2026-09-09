const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==========================================
// ✏️ แก้ไขชื่อผู้จัดทำตรงนี้ได้เลยครับ
// ==========================================
const creatorName = "นาย วัชรพล วงศ์กาศ"; 
const creatorRole = "ผู้พัฒนาเกม & ออกแบบสื่อการเรียนรู้"; 

// ==========================================
// 🔊 ระบบเสียงประกอบ (Web Audio API Synthesizer)
// ==========================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// เสียงคลิกปุ่มทั่วไป
function playClickSound() {
    try {
        initAudio();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
}

// เสียงกดดูคำใบ้
function playHintSound() {
    try {
        initAudio();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
}

// เสียงตอบถูก (+ คะแนน)
function playCorrectSound() {
    try {
        initAudio();
        let now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            gain.gain.setValueAtTime(0.15, now + index * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.15);
        });
    } catch (e) {}
}

// เสียงตอบผิด
function playWrongSound() {
    try {
        initAudio();
        let now = audioCtx.currentTime;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {}
}

// เสียงชนะเกม (Victory Fanfare)
function playVictorySound() {
    try {
        initAudio();
        let now = audioCtx.currentTime;
        let notes = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 659.25, t: 0.15, d: 0.15 },
            { f: 783.99, t: 0.3, d: 0.15 },
            { f: 1046.50, t: 0.45, d: 0.4 }
        ];
        notes.forEach(note => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + note.t);
            gain.gain.setValueAtTime(0.2, now + note.t);
            gain.gain.exponentialRampToValueAtTime(0.01, now + note.t + note.d);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + note.t);
            osc.stop(now + note.t + note.d);
        });
    } catch (e) {}
}

// คลังโจทย์และโครงสร้าง Pixel Art ความละเอียดสูง (16x16 Grid) - รวม 10 ข้อ
const nanoQuestions = [
    {
        name: "ท่อคาร์บอนนาโน (Carbon Nanotubes)",
        hints: [
            "คำใบ้ 1: โครงสร้างทรงกระบอกจากการม้วนแผ่นกราฟีน",
            "คำใบ้ 2: แข็งแรงกว่าเหล็กกล้าหลายเท่า แต่น้ำหนักเบามาก",
            "คำใบ้ 3: นำไฟฟ้าและนำความร้อนได้ดีเยี่ยมระดับสุดยอด"
        ],
        wrongOptions: ["อนุภาคเงินนาโน", "หุ่นยนต์นาโน", "โดตควอนตัม"],
        pixelArt: [
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,1,2,1,1,2,1,1,2,1,1,2,1,2,1,0],
            [0,1,2,1,1,2,1,1,2,1,1,2,1,2,1,0],
            [1,2,1,2,2,1,2,2,1,2,2,1,2,2,1,1],
            [1,2,1,2,2,1,2,2,1,2,2,1,2,2,1,1],
            [1,2,2,1,1,2,1,1,2,1,1,2,1,1,2,1],
            [1,2,2,1,1,2,1,1,2,1,1,2,1,1,2,1],
            [1,2,1,2,2,1,2,2,1,2,2,1,2,2,1,1],
            [1,2,1,2,2,1,2,2,1,2,2,1,2,2,1,1],
            [0,1,2,1,1,2,1,1,2,1,1,2,1,2,1,0],
            [0,1,2,1,1,2,1,1,2,1,1,2,1,2,1,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        colors: { 1: "#00b4d8", 2: "#90e0ef" }
    },
    {
        name: "อนุภาคเงินนาโน (Nano Silver)",
        hints: [
            "คำใบ้ 1: มีคุณสมบัติเด่นในการยับยั้งและฆ่าเชื้อแบคทีเรีย",
            "คำใบ้ 2: นิยมนำไปเคลือบในหน้ากากอนามัย เสื้อผ้า ตู้เย็น",
            "คำใบ้ 3: ปลดปล่อยไอออน Ag+ ไปทำลายผนังเซลล์เชื้อโรค"
        ],
        wrongOptions: ["โดตควอนตัม", "กราฟีน", "ท่อคาร์บอนนาโน"],
        pixelArt: [
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
            [0,0,0,1,2,2,3,3,3,3,2,2,1,0,0,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,0,0,1,2,2,3,3,3,3,2,2,1,0,0,0],
            [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]
        ],
        colors: { 1: "#64748b", 2: "#cbd5e1", 3: "#ffffff" }
    },
    {
        name: "โดตควอนตัม (Quantum Dots)",
        hints: [
            "คำใบ้ 1: เป็นสารกึ่งตัวนำจิ๋วขนาด 2-10 นาโนเมตร",
            "คำใบ้ 2: เปล่งสีแสงต่างกันตามขนาดอนุภาคเมื่อถูกกระตุ้น",
            "คำใบ้ 3: ใช้ทำจอภาพทีวีรุ่นใหม่ (QLED) ให้สีสมจริง"
        ],
        wrongOptions: ["หุ่นยนต์นาโน", "กราฟีน", "อนุภาคเงินนาโน"],
        pixelArt: [
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
            [0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
            [0,0,0,1,2,3,3,3,3,3,3,2,1,0,0,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,0,0,1,2,3,3,3,3,3,3,2,1,0,0,0],
            [0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
            [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
        ],
        colors: { 1: "#ff007f", 2: "#7928ca", 3: "#00dfd8" }
    },
    {
        name: "กราฟีน (Graphene)",
        hints: [
            "คำใบ้ 1: แผ่นคาร์บอนเรียงตัวแบบรังผึ้งหนาเพียง 1 อะตอม",
            "คำใบ้ 2: น้ำหนักเบา ยืดหยุ่นได้ แต่นำไฟฟ้าได้ดีกว่าทองแดง",
            "คำใบ้ 3: ใช้ทำแบตเตอรี่ชาร์จไวและเซนเซอร์จิ๋วอัจฉริยะ"
        ],
        wrongOptions: ["ท่อคาร์บอนนาโน", "อนุภาคเงินนาโน", "โดตควอนตัม"],
        pixelArt: [
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1],
            [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0]
        ],
        colors: { 1: "#10b981", 2: "#a7f3d0" }
    },
    {
        name: "หุ่นยนต์นาโน (Nanobots)",
        hints: [
            "คำใบ้ 1: หุ่นยนต์จักรกลขนาดเล็กระดับไมครอน/นาโนเมตร",
            "คำใบ้ 2: ออกแบบมาเพื่อเข้าไปทำงานในร่างกายมนุษย์",
            "คำใบ้ 3: ใช้ส่งยาตรงถึงเซลล์มะเร็งหรือซ่อมแซมเส้นเลือด"
        ],
        wrongOptions: ["กราฟีน", "โดตควอนตัม", "ท่อคาร์บอนนาโน"],
        pixelArt: [
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,3,3,2,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,2,2,1,1,1,1,1,0,0],
            [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
            [1,2,2,3,3,2,2,2,2,2,2,3,3,2,2,1],
            [1,2,2,3,3,2,2,2,2,2,2,3,3,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,1,1,1,1,1,1,1,1,1,1,2,2,1],
            [0,1,2,2,3,3,3,3,3,3,3,3,2,2,1,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,2,1,0,0,0,0,0,0,1,2,1,0,0],
            [0,0,1,2,1,0,0,0,0,0,0,1,2,1,0,0],
            [0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,0],
            [0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0]
        ],
        colors: { 1: "#d97706", 2: "#fbbf24", 3: "#00ffcc" }
    },
    {
        name: "กระจกทำความสะอาดตัวเองได้ (Self-cleaning Glass)",
        hints: [
            "คำใบ้ 1: เคลือบสารไทเทเนียมไดออกไซด์ (TiO2) ขนาดนาโน",
            "คำใบ้ 2: สลายคราบสกปรกได้เมื่อโดนแสงแดด (Photocatalysis)",
            "คำใบ้ 3: น้ำฝนจะไหลเป็นแผ่นชะล้างคราบออกได้เองโดยไม่เกาะเป็นหยด"
        ],
        wrongOptions: ["กระจกนิรภัย", "กระจกสะท้อนแสง", "เครื่องกรองน้ำนาโน"],
        pixelArt: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,3,3,2,2,2,2,2,2,2,2,3,3,2,1],
            [1,2,3,3,3,2,2,2,2,2,2,3,3,3,2,1],
            [1,2,2,3,3,3,2,2,2,2,3,3,3,2,2,1],
            [1,2,2,2,3,3,3,2,2,3,3,3,2,2,2,1],
            [1,2,2,2,2,3,3,3,3,3,3,2,2,2,2,1],
            [1,2,2,2,2,2,3,3,3,3,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,3,3,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,3,3,3,3,2,2,2,2,2,1],
            [1,2,2,2,2,3,3,3,3,3,3,2,2,2,2,1],
            [1,2,2,2,3,3,3,2,2,3,3,3,2,2,2,1],
            [1,2,2,3,3,3,2,2,2,2,3,3,3,2,2,1],
            [1,2,3,3,3,2,2,2,2,2,2,3,3,3,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        colors: { 1: "#38bdf8", 2: "#0284c7", 3: "#ffffff" }
    },
    {
        name: "สิ่งทอนาโน (Smart Nano Textiles)",
        hints: [
            "คำใบ้ 1: เส้นใยผ้าเคลือบสารนาโนป้องกันสิ่งสกปรก",
            "คำใบ้ 2: มีคุณสมบัติกันน้ำและของเหลวเหมือนใบบัว (Lotus Effect)",
            "คำใบ้ 3: ช่วยลดการยับ ระบายอากาศได้ดี และยับยั้งกลิ่นอับ"
        ],
        wrongOptions: ["ผ้าฝ้ายธรรมชาติ", "เส้นใยสังเคราะห์", "สิ่งทอดิจิทัล"],
        pixelArt: [
            [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
            [0,1,2,2,2,1,0,0,0,0,1,2,2,2,1,0],
            [1,2,2,2,2,2,1,1,1,1,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,2,3,3,2,2,2,2,2,2,3,3,2,2,1],
            [0,1,2,3,3,2,2,2,2,2,2,3,3,2,1,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ],
        colors: { 1: "#818cf8", 2: "#6366f1", 3: "#e0e7ff" }
    },
    {
        name: "เซลล์สุริยะนาโน (Nano Solar Cells)",
        hints: [
            "คำใบ้ 1: ใช้สารเคลือบระดับนาโนช่วยดูดกลืนแสงอาทิตย์",
            "คำใบ้ 2: มีประสิทธิภาพในการเปลี่ยนแสงเป็นพลังงานไฟฟ้าสูงขึ้น",
            "คำใบ้ 3: สามารถดัดโค้งงอและยืดหยุ่น ติดตั้งบนพื้นผิวต่างๆ ได้ง่าย"
        ],
        wrongOptions: ["แผงโซลาร์เซลล์แบบเก่า", "กังหันลมไฟฟ้า", "แบตเตอรี่ลิเธียม"],
        pixelArt: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,1,2,2,1,2,2,1,2,2,1,2,2,1],
            [1,2,2,1,2,2,1,2,2,1,2,2,1,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,1,2,3,1,2,2,1,2,3,1,2,2,1],
            [1,2,2,1,3,3,1,2,2,1,3,3,1,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,3,1,2,2,1,2,3,1,2,2,1,2,2,1],
            [1,3,3,1,2,2,1,3,3,1,2,2,1,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,1,2,2,1,2,2,1,2,2,1,2,3,1],
            [1,2,2,1,2,2,1,2,2,1,2,2,1,3,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0]
        ],
        colors: { 1: "#1e293b", 2: "#1d4ed8", 3: "#fde047" }
    },
    {
        name: "วัสดุฉลาดนาโน (Smart Nano Materials)",
        hints: [
            "คำใบ้ 1: วัสดุที่สามารถตอบสนองต่อสิ่งแวดล้อมภายนอกได้",
            "คำใบ้ 2: เปลี่ยนรูปร่างหรือสีได้เมื่อเจออุณหภูมิ แสง หรือแรงดัน",
            "คำใบ้ 3: นำไปใช้ทำเซนเซอร์อัจฉริยะและวัสดุสมานรอยแตกเองได้"
        ],
        wrongOptions: ["พลาสติกทั่วไป", "โลหะผสมผสม", "พลาสติกรีไซเคิล"],
        pixelArt: [
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
            [0,1,2,2,3,3,3,3,3,3,3,3,2,2,1,0],
            [0,1,2,3,3,1,1,3,3,1,1,3,3,2,1,0],
            [1,2,3,3,1,1,1,3,3,1,1,1,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [1,2,3,3,1,1,1,1,1,1,1,1,3,3,2,1],
            [1,2,3,3,3,1,1,1,1,1,1,3,3,3,2,1],
            [1,2,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            [0,1,2,3,3,3,3,3,3,3,3,3,3,2,1,0],
            [0,1,2,2,3,3,3,3,3,3,3,3,2,2,1,0],
            [0,0,1,1,2,2,2,2,2,2,2,2,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        colors: { 1: "#ec4899", 2: "#f43f5e", 3: "#a855f7" }
    },
    {
        name: "เครื่องกรองน้ำนาโน (Nano Water Filter)",
        hints: [
            "คำใบ้ 1: เยื่อกรองที่มีรูพรุนขนาดเล็กระดับนาโนเมตร",
            "คำใบ้ 2: ดักจับและแยกแบคทีเรีย ไวรัส และโลหะหนักออกจากน้ำ",
            "คำใบ้ 3: ใช้กรองน้ำเค็มให้กลายเป็นน้ำดื่มบริสุทธิ์ได้สะอาดหมดจด"
        ],
        wrongOptions: ["ถังดักไขมัน", "เครื่องกรองหยาบ", "ตะแกรงกรองฝุ่น"],
        pixelArt: [
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
            [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
            [0,0,0,1,2,3,3,3,3,3,3,2,1,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,0,1,3,3,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,3,3,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
            [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]
        ],
        colors: { 1: "#0284c7", 2: "#38bdf8", 3: "#e0f2fe" }
    }
];

// ตัวแปรระบบเกม
let score = 0;
const targetScore = 10;
let currentQuestion = null;
let currentHintIndex = 0;
let gameState = "START_SCREEN"; 

// ตัวแปร Visual Effects
let pixelParticles = [];
let floatingTexts = [];
let shakeAmount = 0;
let flashColor = null;
let flashTimer = 0;
let feedbackMessage = "";
let showPixelArt = false;
let confetti = [];
let buttons = [];

let contentAlpha = 1;
let transitionState = "IDLE";
let isClickBlocked = false;

// 🎬 ระบบ Ultra-Smooth & Slow Full-Screen Pixel Transition
let gameIntroProgress = 0;
let isIntroActive = false;
const introStripes = 16; 

const startBtn = { x: 200, y: 190, width: 200, height: 50 };
const restartBtn = { x: 200, y: 300, width: 200, height: 45 }; 
let isHoverStartBtn = false;
let isHoverRestartBtn = false;

// สมการความนุ่มนวลชั้นสูง (Ease-In-Out Quintic)
function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function nextQuestion() {
    let randomIndex = Math.floor(Math.random() * nanoQuestions.length);
    let q = nanoQuestions[randomIndex];
    
    let options = [q.name, ...q.wrongOptions];
    options.sort(() => Math.random() - 0.5);

    currentQuestion = { name: q.name, hints: q.hints, options: options, pixelArt: q.pixelArt, colors: q.colors };
    currentHintIndex = 0;
    showPixelArt = false;
    feedbackMessage = "";

    buttons = [];
    let startY = 240;
    options.forEach((opt, index) => {
        let x = (index % 2 === 0) ? 50 : 320;
        let y = startY + Math.floor(index / 2) * 60;
        buttons.push({ x: x, y: y, width: 230, height: 45, text: opt });
    });
}

function restartGame() {
    playClickSound();
    score = 0;
    gameState = "PLAYING";
    isClickBlocked = false;
    nextQuestion();
}

function startTransitionToNextQuestion() {
    isClickBlocked = true;
    transitionState = "FADING_OUT";
}

function updateTransition() {
    if (transitionState === "FADING_OUT") {
        contentAlpha -= 0.05;
        if (contentAlpha <= 0) {
            contentAlpha = 0;
            nextQuestion();
            transitionState = "FADING_IN";
        }
    } else if (transitionState === "FADING_IN") {
        contentAlpha += 0.05;
        if (contentAlpha >= 1) {
            contentAlpha = 1;
            transitionState = "IDLE";
            isClickBlocked = false;
        }
    }
}

function updateGameIntroAnimation() {
    if (isIntroActive) {
        gameIntroProgress += 0.0045; 

        if (gameIntroProgress >= 0.5 && gameState === "START_SCREEN") {
            gameState = "PLAYING";
            score = 0;
            nextQuestion();
        }

        if (gameIntroProgress >= 1.0) {
            isIntroActive = false;
            gameIntroProgress = 0;
            isClickBlocked = false;
        }
    }
}

function drawGameIntroAnimation() {
    if (!isIntroActive) return;

    ctx.save();
    let stripeWidth = canvas.width / introStripes;

    for (let i = 0; i < introStripes; i++) {
        let delay = (i / introStripes) * 0.3;
        let localProgress = Math.max(0, Math.min(1, (gameIntroProgress - delay) / 0.7));

        if (localProgress > 0) {
            let smoothProgress = easeInOutQuint(localProgress);
            
            let coverHeight = Math.sin(smoothProgress * Math.PI) * canvas.height;
            let startY = (canvas.height - coverHeight) / 2;
            let startX = i * stripeWidth;

            ctx.fillStyle = "#0f172a";
            ctx.fillRect(startX, startY, stripeWidth + 1.5, coverHeight);

            ctx.fillStyle = "#00ffcc";
            ctx.fillRect(startX, startY, stripeWidth + 1.5, 4);
            ctx.fillRect(startX, startY + coverHeight - 4, stripeWidth + 1.5, 4);

            ctx.strokeStyle = "rgba(0, 255, 204, 0.15)";
            ctx.lineWidth = 1;
            ctx.strokeRect(startX, startY, stripeWidth, coverHeight);
        }
    }
    ctx.restore();
}

function createPixelExplosion(x, y) {
    for (let i = 0; i < 80; i++) {
        let colorKeys = Object.keys(currentQuestion.colors);
        let randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        let color = flashColor === 'green' ? currentQuestion.colors[randomKey] : "#ff0055";
        
        pixelParticles.push({
            x: x + (Math.random() - 0.5) * 90,
            y: y + (Math.random() - 0.5) * 90,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            color: color,
            alpha: 1,
            fadeSpeed: Math.random() * 0.012 + 0.008
        });
    }
}

function addFloatingText(text, x, y, color) {
    floatingTexts.push({ text: text, x: x, y: y, alpha: 1, color: color });
}

function createConfetti() {
    confetti = [];
    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 1.5 - 0.75,
            rotation: Math.random() * 360
        });
    }
}

function drawPixelArtImage(x, y, size, matrix, colors) {
    let pixelSize = size / 16;
    for (let r = 0; r < 16; r++) {
        for (let c = 0; c < 16; c++) {
            let val = matrix[r][c];
            if (val > 0) {
                ctx.fillStyle = colors[val] || "#ffffff";
                ctx.fillRect(x + (c * pixelSize), y + (r * pixelSize), pixelSize - 0.5, pixelSize - 0.5);
            }
        }
    }
}

function drawMainBox(x, y, size) {
    ctx.save();

    let shakeX = 0;
    let shakeY = 0;
    if (shakeAmount > 0) {
        shakeX = Math.sin(Date.now() * 0.05) * shakeAmount;
        shakeY = Math.cos(Date.now() * 0.05) * (shakeAmount * 0.5);
        shakeAmount *= 0.93;
    }

    ctx.translate(x + shakeX, y + shakeY);

    ctx.shadowBlur = 20;
    ctx.shadowColor = flashColor === 'red' ? '#ff0055' : (flashColor === 'green' ? '#00ffcc' : '#f59e0b');

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = flashColor === 'red' ? '#ff0055' : (flashColor === 'green' ? '#00ffcc' : '#fbbf24');
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, size, size);

    if (showPixelArt) {
        drawPixelArtImage(10, 10, size - 20, currentQuestion.pixelArt, currentQuestion.colors);
    } else {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(6, 6, size - 12, size - 12);

        ctx.fillStyle = '#78350f';
        ctx.fillRect(10, 10, 10, 10);
        ctx.fillRect(size - 20, 10, 10, 10);
        ctx.fillRect(10, size - 20, 10, 10);
        ctx.fillRect(size - 20, size - 20, 10, 10);

        ctx.fillStyle = "#ffffff";
        ctx.font = 'bold 65px Tahoma, "Leelawadee UI", sans-serif';
        ctx.fillText("?", 37, 90);
    }

    ctx.restore();
}

window.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    if (gameState === "START_SCREEN" && !isIntroActive) {
        if (mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.width &&
            mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.height) {
            isHoverStartBtn = true;
            canvas.style.cursor = "pointer";
        } else {
            isHoverStartBtn = false;
            canvas.style.cursor = "default";
        }
    } else if (gameState === "WON") {
        if (mouseX >= restartBtn.x && mouseX <= restartBtn.x + restartBtn.width &&
            mouseY >= restartBtn.y && mouseY <= restartBtn.y + restartBtn.height) {
            isHoverRestartBtn = true;
            canvas.style.cursor = "pointer";
        } else {
            isHoverRestartBtn = false;
            canvas.style.cursor = "default";
        }
    } else {
        canvas.style.cursor = "default";
    }
});

window.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    if (gameState === "START_SCREEN" && !isIntroActive) {
        if (mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.width &&
            mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.height) {
            playClickSound();
            isIntroActive = true;
            isClickBlocked = true;
        }
        return;
    }

    if (gameState === "WON") {
        if (mouseX >= restartBtn.x && mouseX <= restartBtn.x + restartBtn.width &&
            mouseY >= restartBtn.y && mouseY <= restartBtn.y + restartBtn.height) {
            restartGame();
        }
        return;
    }

    if (gameState !== "PLAYING" || isClickBlocked) return;

    // ปุ่มกด Scan คำใบ้เพิ่ม
    if (mouseX >= 420 && mouseX <= 550 && mouseY >= 140 && mouseY <= 175) {
        if (currentHintIndex < currentQuestion.hints.length - 1) {
            playHintSound();
            currentHintIndex++;
        }
        return;
    }

    buttons.forEach(btn => {
        if (mouseX >= btn.x && mouseX <= btn.x + btn.width &&
            mouseY >= btn.y && mouseY <= btn.y + btn.height) {
            
            showPixelArt = true;

            if (btn.text === currentQuestion.name) {
                score++;
                flashColor = 'green';
                flashTimer = 25;
                feedbackMessage = `✨ ถูกต้อง! นี่คือ ${currentQuestion.name}`;
                
                playCorrectSound(); // เล่นเสียงตอบถูก
                createPixelExplosion(105, 90);
                addFloatingText("+1 SCORE!", 105, 80, "#00ffcc");

                if (score >= targetScore) {
                    gameState = "WON";
                    playVictorySound(); // เล่นเสียงชนะเกม
                    createConfetti();
                } else {
                    isClickBlocked = true;
                    setTimeout(() => { startTransitionToNextQuestion(); }, 1200);
                }
            } else {
                flashColor = 'red';
                flashTimer = 25;
                shakeAmount = 12;
                feedbackMessage = `❌ ผิด! เฉลย: ${currentQuestion.name}`;
                
                playWrongSound(); // เล่นเสียงตอบผิด
                createPixelExplosion(105, 90);
                addFloatingText("WRONG!", 105, 80, "#ff0055");

                isClickBlocked = true;
                setTimeout(() => { startTransitionToNextQuestion(); }, 1000);
            }
        }
    });
});

function drawStartScreen() {
    ctx.textAlign = "center";

    ctx.fillStyle = "#00ffcc";
    ctx.font = 'bold 32px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText("🔬 NANO TECH PIXEL GUESS", canvas.width / 2, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = '16px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText("เกมทายชื่อเทคโนโลยีนาโนสุดล้ำจากภาพ Pixel Art", canvas.width / 2, 130);

    ctx.fillStyle = isHoverStartBtn ? "#00ffcc" : "#1e293b";
    ctx.fillRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);

    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 2;
    ctx.strokeRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);

    ctx.fillStyle = isHoverStartBtn ? "#0f172a" : "#00ffcc";
    ctx.font = 'bold 20px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText("🎮 เริ่มเล่นเกม", canvas.width / 2, startBtn.y + 32);

    ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
    ctx.fillRect(100, 280, 400, 70);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 280, 400, 70);

    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 14px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText("👨‍💻 จัดทำโดย", canvas.width / 2, 303);

    ctx.fillStyle = "#ffffff";
    ctx.font = '15px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText(creatorName, canvas.width / 2, 325);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = '12px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText(creatorRole, canvas.width / 2, 342);

    ctx.textAlign = "start";
}

function drawBackground() {
    const time = Date.now() * 0.00035;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#07111f");
    gradient.addColorStop(0.5, "#10233a");
    gradient.addColorStop(1, "#06151a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    const nodes = [
        { x: 35, y: 55, radius: 2, phase: 0 },
        { x: 560, y: 70, radius: 3, phase: 1.4 },
        { x: 520, y: 350, radius: 2, phase: 2.3 },
        { x: 70, y: 365, radius: 3, phase: 3.1 }
    ];
    nodes.forEach(node => {
        const pulse = 0.45 + Math.sin(time + node.phase) * 0.25;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(node.x, node.y, node.radius, node.radius);
        ctx.globalAlpha = pulse * 0.25;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12 + Math.sin(time + node.phase) * 4, 0, Math.PI * 2);
        ctx.stroke();
    });
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    updateGameIntroAnimation();

    if (gameState === "START_SCREEN") {
        drawStartScreen();
        drawGameIntroAnimation();
        return;
    }

    updateTransition();

    if (flashTimer > 0) {
        flashTimer--;
        ctx.fillStyle = flashColor === 'green' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        flashColor = null;
    }

    if (gameState === "WON") {
        confetti.forEach(p => {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += 2;
            if (p.y > canvas.height) p.y = -10;
        });

        ctx.font = '80px Tahoma, "Leelawadee UI", sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("🏆", canvas.width / 2, 130);

        ctx.fillStyle = "#00ffcc";
        ctx.font = 'bold 26px Tahoma, "Leelawadee UI", sans-serif';
        ctx.fillText("🎉 VICTORY! ครบ 10 คะแนนแล้ว", canvas.width / 2, 200);

        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.fillText("คุณคือสุดยอดผู้เชี่ยวชาญด้าน IT & Nanotechnology", canvas.width / 2, 240);

        // วาดปุ่ม "เล่นใหม่อีกครั้ง"
        ctx.fillStyle = isHoverRestartBtn ? "#00ffcc" : "#1e293b";
        ctx.fillRect(restartBtn.x, restartBtn.y, restartBtn.width, restartBtn.height);

        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 2;
        ctx.strokeRect(restartBtn.x, restartBtn.y, restartBtn.width, restartBtn.height);

        ctx.fillStyle = isHoverRestartBtn ? "#0f172a" : "#00ffcc";
        ctx.font = 'bold 18px Tahoma, "Leelawadee UI", sans-serif';
        ctx.fillText("🔄 เล่นใหม่อีกครั้ง", canvas.width / 2, restartBtn.y + 29);

        ctx.textAlign = "start";
        return;
    }

    ctx.save();
    ctx.globalAlpha = contentAlpha;

    drawMainBox(45, 30, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 16px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText(`คะแนนสะสม: ${score} / ${targetScore}`, 210, 40);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(210, 50, 200, 12);
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(210, 50, (score / targetScore) * 200, 12);

    ctx.fillStyle = "#00e5ff";
    ctx.font = '14px Tahoma, "Leelawadee UI", sans-serif';
    for (let i = 0; i <= currentHintIndex; i++) {
        ctx.fillText(currentQuestion.hints[i], 210, 95 + (i * 22));
    }

    if (currentHintIndex < currentQuestion.hints.length - 1) {
        ctx.fillStyle = "#334155";
        ctx.fillRect(420, 145, 130, 32);
        ctx.fillStyle = "#00ffcc";
        ctx.font = "12px Arial";
        ctx.fillText("🔍 Scan คำใบ้เพิ่ม", 432, 166);
    }

    ctx.fillStyle = feedbackMessage.includes("ถูกต้อง") ? "#00ffcc" : "#ff0055";
    ctx.font = 'bold 13px Tahoma, "Leelawadee UI", sans-serif';
    ctx.fillText(feedbackMessage, 50, 215);

    buttons.forEach(btn => {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1;
        ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Arial";
        ctx.fillText(btn.text, btn.x + 10, btn.y + 27);
    });

    ctx.restore();

    pixelParticles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fadeSpeed;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;

        if (p.alpha <= 0) pixelParticles.splice(index, 1);
    });

    floatingTexts.forEach((ft, index) => {
        ft.y -= 0.5;
        ft.alpha -= 0.012;
        ctx.fillStyle = ft.color;
        ctx.font = "bold 18px Arial";
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillText(ft.text, ft.x - 20, ft.y);
        ctx.globalAlpha = 1;

        if (ft.alpha <= 0) floatingTexts.splice(index, 1);
    });

    drawGameIntroAnimation();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();