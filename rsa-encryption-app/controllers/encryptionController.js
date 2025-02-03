const { encryptData, decryptData } = require("../services/encryptionService");

// Encrypt Data Controller
const encrypt = (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required for encryption" });
  }
  const encryptedText = encryptData(text);
  res.json({ encryptedText });
  return
};

// Decrypt Data Controller
const decrypt = (req, res) => {
  const { encryptedText } = req.body;
  if (!encryptedText) {
    return res.status(400).json({ error: "Encrypted text is required for decryption" });
  }
  try {
    const decryptedText = decryptData(encryptedText);
    res.json({ decryptedText });
  } catch (error) {
    res.status(500).json({ error: "Decryption failed" });
  }
};

module.exports = { encrypt, decrypt };
