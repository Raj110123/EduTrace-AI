const crypto = require('crypto');

/**
 * Generates a random alphanumeric code of a specified length
 * @param {number} length - Length of the code
 * @returns {string} - Generated code in uppercase
 */
const generateClassCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = generateClassCode;
