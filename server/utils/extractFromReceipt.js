module.exports = async function extractFromReceipt(filePath) {
  return [
    {
      type: 'expense',
      category: 'Food',
      amount: 120,
      date: new Date(),
      description: 'Lunch',
    },
  ];
};
