const express = require("express");
const { encrypt, decrypt } = require("../controllers/encryptionController");
const { runShellCommand } = require("../controllers/balanceController");

const router = express.Router();

router.post("/encrypt", encrypt);
router.post("/decrypt", decrypt);
router.get("/balance", async (req, res) => {
  try {
    const balance = await runShellCommand(
      "../lottery-app/func.sh balance $PROXY_CONTRACT_ID1"
    );
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});
router.get("/buyTicket", async (req, res) => {
  try {
    const balance = await runShellCommand(
      "../lottery-app/func.sh fund_princ $PROXY_CONTRACT_ID1 1000"
    );
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
