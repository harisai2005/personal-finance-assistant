// backend/utils/extractFromReceipt.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { createCanvas } = require('canvas');
const Tesseract = require('tesseract.js');
const { convert } = require('pdf-poppler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/transaction');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const isPDF = (filePath) => path.extname(filePath).toLowerCase() === '.pdf';
const isImage = (filePath) => ['.png', '.jpg', '.jpeg'].includes(path.extname(filePath).toLowerCase());

const extractTextFromPDF = async (filePath) => {
  console.log('📄 Reading text from PDF...');
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    const text = data.text || '';
    console.log('📝 Extracted Text Preview:', text.slice(0, 300));
    return text;
  } catch (err) {
    console.warn('⚠️ PDF parse failed:', err.message);
    return '';
  }
};

const convertPDFToImage = async (filePath) => {
  const outDir = path.dirname(filePath);
  const outPrefix = path.basename(filePath, '.pdf');
  const options = {
    format: 'png',
    out_dir: outDir,
    out_prefix: outPrefix,
    page: 1,
  };

  console.log('🖼️ Converting PDF to image for OCR...');
  await convert(filePath, options);

  const expectedImagePath = path.join(outDir, `${outPrefix}-1.png`);
  if (!fs.existsSync(expectedImagePath)) {
    throw new Error(`Converted image not found: ${expectedImagePath}`);
  }

  return fs.readFileSync(expectedImagePath);
};

const runOCR = async (imageBuffer) => {
  console.log('🔍 Running OCR with Tesseract...');
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
  console.log('📷 OCR Result (preview):', text.slice(0, 300));
  return text;
};

const extractTextFromImage = async (filePath) => {
  console.log('🖼️ Extracting text from uploaded image...');
  const imageBuffer = fs.readFileSync(filePath);
  return await runOCR(imageBuffer);
};

const buildGeminiPrompt = (text, mode) => {
  if (mode === 'history') {
    return `
You are a helpful transaction parser. Given a bank statement or table of transactions, extract the data into the following JSON array format:

[
  {
    "date": "YYYY-MM-DD",
    "description": "string",
    "category": "string",
    "amount": number,
    "type": "income" | "expense"
  },
  ...
]

Extract accurately.

Text:
"""${text}"""
`.trim();
  }

  return `
You are a helpful receipt parser. Given the OCR-extracted or raw text below, extract and return the structured JSON:

{
  "invoice_date": "...",
  "invoice_number": "...",
  "vendor": "...",
  "items": [{ "description": "...", "amount": 0 }],
  "total_amount": 0,
  "amount_in_words": "..."
}

Receipt Text:
"""${text}"""
`.trim();
};

const cleanJSONResponse = (rawText) => {
  return rawText.replace(/```json/g, '').replace(/```/g, '').trim();
};

const sendToGemini = async (text, mode) => {
  try {
    console.log("📤 Sending to Gemini via official SDK...");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildGeminiPrompt(text, mode);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const geminiText = response.text();

    console.log("📄 Gemini Raw JSON:", geminiText.slice(0, 300));
    const clean = cleanJSONResponse(geminiText);
    return JSON.parse(clean);
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    return mode === 'history' ? [] : {};
  }
};

// ✅ Main Extraction Handler
module.exports = async function extractFromReceipt(filePath, userId, mode = 'pos') {
  try {
    let text = '';

    if (isPDF(filePath)) {
      text = await extractTextFromPDF(filePath);
      if (!text || text.trim().length < 30) {
        console.warn('⚠️ No text or failed parse. Falling back to OCR...');
        const imageBuffer = await convertPDFToImage(filePath);
        text = await runOCR(imageBuffer);
      }
    } else if (isImage(filePath)) {
      text = await extractTextFromImage(filePath);
    } else {
      throw new Error('Only PDF or image files supported.');
    }

    const parsed = await sendToGemini(text, mode);

    if (mode === 'history') {
      if (!Array.isArray(parsed)) throw new Error('Invalid transaction array from Gemini');

      const docs = await Promise.all(parsed.map(async (txn) => {
        const created = await Transaction.create({
          userId,
          ...txn,
          date: txn.date ? new Date(txn.date) : new Date(),
        });
        return created;
      }));

      console.log(`✅ Inserted ${docs.length} transactions from history`);
      return docs;
    }

    // POS mode
    const vendor = parsed.vendor || 'Unknown';
    const invoiceDate = new Date(parsed.invoice_date || Date.now());
    const totalAmount = parsed.total_amount || 0;

    let description = 'Receipt Items';
    if (Array.isArray(parsed.items)) {
      description = parsed.items.map(item =>
        `${item.description || 'Item'}`
      ).join(', ');
    }

    const category = /food|zomato|swiggy|milk|bread|combo/i.test(description) ? 'Food' : 'General';

    const tx = await Transaction.create({
      userId,
      type: 'expense',
      amount: totalAmount,
      description,
      category,
      date: invoiceDate,
      vendor,
    });

    console.log(`✅ Inserted one POS receipt transaction`);
    return [tx];

  } catch (err) {
    console.error('❌ Receipt Extraction Failed:', err.message);
    return [];
  }
};
