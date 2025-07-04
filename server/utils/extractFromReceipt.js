module.exports = async function extractFromReceipt(filePath) {
  // Placeholder: implement OCR/PDF parsing later
  return [
    { category: 'Food', amount: 120, type: 'expense', date: new Date(), description: 'Lunch' },
    { category: 'Transport', amount: 50, type: 'expense', date: new Date(), description: 'Bus' }
  ];
};
