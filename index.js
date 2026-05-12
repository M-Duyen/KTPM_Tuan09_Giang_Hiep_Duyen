const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let nextBookingId = 1;
const bookings = [];

app.post("/bookings", (req, res) => {
  const { userId, tourId, amount } = req.body;
  if (!userId || !tourId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const booking = {
    id: nextBookingId++,
    userId,
    tourId,
    amount,
    status: "CREATED",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  res.status(201).json({ success: true, booking });
});

const PORT = 8083;
app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
