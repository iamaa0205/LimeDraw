const express = require("express");
const { encrypt, decrypt } = require("../controllers/encryptionController");

const router = express.Router();

router.post("/encrypt", encrypt);
router.post("/decrypt", decrypt);

module.exports = router;
