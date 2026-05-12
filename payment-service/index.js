const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/payments", (req, res) => {
  const { bookingId, amount } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const isSuccess = Math.random() < 0.8;

  if (isSuccess) {
    res.json({
      success: true,
      transactionId: `TXN-${Date.now()}`,
      message: "Payment successful",
    });
  } else {
    res
      .status(400)
      .json({
        success: false,
        message: "Payment failed due to insufficient funds or bank error",
      });
  }
});

const PORT = 8084;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
