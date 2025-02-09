const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const publicKeyPath = path.join(__dirname, "../keys/public.pem");
const privateKeyPath = path.join(__dirname, "../keys/private.pem");

// Read Public and Private Keys
const publicKey = fs.readFileSync(publicKeyPath, "utf8");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

// Encrypt with Public Key
const encryptData = (data) => {
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );
  return encryptedBuffer.toString("base64"); // Return as base64 string
};

// Decrypt with Private Key
const decryptData = (encryptedData) => {
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedData, "base64")
  );
  return decryptedBuffer.toString();
};

module.exports = { encryptData, decryptData };
