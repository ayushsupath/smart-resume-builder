const extractTextFromPDF = async (buffer) => {
  try {
    // Convert buffer to text using simple approach
    const text = buffer.toString('utf-8', 0, buffer.length);
    // Extract readable text (remove binary characters)
    const cleanText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleanText || 'Could not extract text from PDF';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return 'Could not extract text from PDF';
  }
};

module.exports = { extractTextFromPDF };
