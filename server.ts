import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client with aistudio-build telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function generateHeuristicAnalysis(
  examTitle: string,
  score: number,
  maxScore: number,
  topicBreakdown: any[],
  targetFaculty?: string
): string {
  const percentage = Math.round((score / maxScore) * 100);
  const weakTopics = (topicBreakdown || []).filter((t: any) => t.percentage < 60);
  const strongTopics = (topicBreakdown || []).filter((t: any) => t.percentage >= 70);

  let output = `📊 **ผลการวิเคราะห์สมรรถนะ: ${examTitle}**\n\n`;
  output += `• **คะแนนรวม:** ${score}/${maxScore} (${percentage}%)\n`;
  output += `• **เป้าหมาย:** ${targetFaculty || 'คณะเป้าหมาย'}\n\n`;

  if (strongTopics.length > 0) {
    output += `🌟 **จุดแข็งที่ยอดเยี่ยม (Strengths):**\n`;
    strongTopics.forEach((t: any) => {
      output += `- **${t.topic}**: ความแม่นยำ ${t.percentage}% (${t.correct}/${t.total} ข้อ) คุมเวลาและความเข้าใจคอนเซปต์ได้ดีเยี่ยม ควรรักษาความแม่นยำนี้ไว้\n`;
    });
    output += `\n`;
  }

  if (weakTopics.length > 0) {
    output += `🎯 **จุดที่ควรเร่งพัฒนา (Priority Weaknesses):**\n`;
    weakTopics.forEach((t: any) => {
      output += `- **${t.topic}**: ความแม่นยำเพียง ${t.percentage}% (${t.correct}/${t.total} ข้อ) พบว่ามักสับสนสูตรหรือการแยกกรณีโจทย์\n`;
    });
    output += `\n`;
  }

  output += `📌 **คำแนะนำกลยุทธ์ 7 วัน (Action Plan):**\n`;
  if (weakTopics.length > 0) {
    output += `1. เริ่มต้นจากการทบทวนนิยามและสูตรหลักของเรื่อง "${weakTopics[0].topic}" วันละ 30 นาที\n`;
    output += `2. เปิด **My Mistake Book (คลังข้อผิดพลาด)** เพื่อกดปุ่ม "ฝึกซ้ำข้อที่ผิด" ให้เกิดความคุ้นชินรูปแบบโจทย์\n`;
    output += `3. ทดลองทำ Mock Test อีกครั้งใน 3 วันถัดไป เพื่อดูพัฒนาการคะแนนและรับเหรียญรางวัลความก้าวหน้า!`;
  } else {
    output += `1. ผลคะแนนอยู่ในเกณฑ์ดีเยี่ยม ฝึกจับเวลาให้เร็วขึ้น 10-15% เพื่อสร้างความคุ้นชินกับสภาวะกดดันจริง\n`;
    output += `2. ตะลุยโจทย์ประยุกต์ระดับยาก (Hard) เพื่อดันคะแนนสู่ระดับ Top Percentile ของประเทศ`;
  }

  return output;
}

// API: AI Weakness & Strengths Analysis
app.post('/api/ai/analyze-weakness', async (req, res) => {
  try {
    const { examTitle, score, maxScore, topicBreakdown, targetFaculty, targetUniversity } = req.body;

    if (!ai) {
      return res.json({
        analysis: generateHeuristicAnalysis(examTitle, score, maxScore, topicBreakdown, targetFaculty),
        source: 'smart-rubric',
      });
    }

    const prompt = `คุณคือโค้ชผู้เชี่ยวชาญการเตรียมสอบ TCAS, TGAT, TPAT และ A-LEVEL สำหรับนักเรียนไทย
ช่วยเขียนบทวิเคราะห์ผลสอบแบบมืออาชีพ มีโครงสร้างชัดเจน ให้กำลังใจ และนำไปปฏิบัติได้จริง:
- ข้อสอบ: ${examTitle}
- คะแนน: ${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%)
- คณะเป้าหมาย: ${targetFaculty || 'คณะวิศวกรรมศาสตร์'} มหาวิทยาลัย: ${targetUniversity || 'จุฬาลงกรณ์มหาวิทยาลัย'}
- สรุปแยกตามบทย่อย:
${JSON.stringify(topicBreakdown, null, 2)}

กรุณาเขียนให้มี 4 หัวข้อหลัก (ใช้ Markdown bullet ชัดเจน):
1. 🌟 จุดแข็งที่ทำได้ดี (Strengths)
2. 🎯 จุดที่ต้องเร่งพัฒนาเป็นพิเศษ (Priority Weaknesses) อธิบายว่าจุดใดที่นักเรียนมักเสียคะแนน
3. 📋 แผนติวเข้มเร่งด่วน 7 วัน (7-Day Action Plan)
4. 🏫 การประเมินความพร้อมสู่คณะเป้าหมาย (University Readiness Insight)

ข้อควรระวัง: ระบุเสมอว่าเป็นค่าประเมินความพร้อมจากการจำลอง ไม่ใช่การรับประกันผลสอบจริง`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      analysis: response.text || generateHeuristicAnalysis(examTitle, score, maxScore, topicBreakdown, targetFaculty),
      source: 'gemini',
    });
  } catch (error: any) {
    console.warn('Gemini call error, using fallback analysis:', error.message);
    const fallback = generateHeuristicAnalysis(
      req.body.examTitle,
      req.body.score,
      req.body.maxScore,
      req.body.topicBreakdown,
      req.body.targetFaculty
    );
    res.json({
      analysis: fallback,
      source: 'fallback',
    });
  }
});

// API: Explain Question Step-by-Step
app.post('/api/ai/explain-question', async (req, res) => {
  try {
    const { questionPrompt, options, correctAnswer, userAnswer, explanation, topic } = req.body;

    if (!ai) {
      return res.json({
        explanation: `${explanation}\n\n💡 ข้อแนะนำ: สำหรับเรื่อง ${topic} ลองจดบันทึกลงใน My Mistake Book และฝึกทำซ้ำ`,
        source: 'smart-rubric',
      });
    }

    const prompt = `ช่วยอธิบายเฉลยโจทย์ข้อนี้อย่างละเอียด เป็นขั้นเป็นตอน และมีทิปส์จำง่ายสำหรับนักเรียนไทย:
- บทเรียน: ${topic}
- โจทย์: ${questionPrompt}
- ตัวเลือก: ${JSON.stringify(options)}
- คำตอบที่ถูกต้อง: ${correctAnswer}
- คำตอบที่นักเรียนเลือก: ${userAnswer}
- เฉลยมาตรฐาน: ${explanation}

โปรดให้:
1. สรุปแนวคิดหัวใจสำคัญ (Core Concept)
2. วิธีทำทีละขั้นตอนอย่างละเอียด (Step-by-step breakdown)
3. ทำไมตัวเลือกอื่นจึงผิด หรือจุดที่คนมักโดนหลอก (Common Trap)
4. เทคนิคคิดลัดในห้องสอบ (Exam Shortcut)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      explanation: response.text || explanation,
      source: 'gemini',
    });
  } catch (error: any) {
    res.json({
      explanation: req.body.explanation,
      source: 'fallback',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RISE App server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
