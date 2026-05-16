const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:8081';
const TOUR_SERVICE = process.env.TOUR_SERVICE_URL || 'http://localhost:8082';
const BOOKING_SERVICE = process.env.BOOKING_SERVICE_URL || 'http://localhost:8083';
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8084';

// 1. Proxy Login to User Service
app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'User Service unavailable' });
    }
  }
});

// 2. Proxy Get Tours to Tour Service
app.get('/tours', async (req, res) => {
  try {
    const response = await axios.get(`${TOUR_SERVICE}/tours`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Tour Service unavailable' });
  }
});

// 3. Proxy Get Tour by ID
app.get('/tours/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TOUR_SERVICE}/tours/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Tour Service unavailable' });
    }
  }
});

// 4. Orchestrate Book Tour Flow
app.post('/book-tour', async (req, res) => {
  const { userId, tourId } = req.body;
  
  if (!userId || !tourId) {
    return res.status(400).json({ message: 'userId and tourId are required' });
  }

  try {
    // Step 1: Validate User
    console.log(`[Orchestrator] Validating User ${userId}...`);
    await axios.get(`${USER_SERVICE}/users/${userId}`);

    // Step 2: Get Tour Info
    console.log(`[Orchestrator] Getting Tour info ${tourId}...`);
    const tourResponse = await axios.get(`${TOUR_SERVICE}/tours/${tourId}`);
    const tourInfo = tourResponse.data;

    // Step 3: Create Booking
    console.log(`[Orchestrator] Creating booking for User ${userId}, Tour ${tourId}...`);
    const bookingResponse = await axios.post(`${BOOKING_SERVICE}/bookings`, {
      userId,
      tourId,
      amount: tourInfo.price
    });
    const bookingId = bookingResponse.data.booking.id;

    // Step 4: Call Payment Service
    console.log(`[Orchestrator] Processing payment for Booking ${bookingId}...`);
    const paymentResponse = await axios.post(`${PAYMENT_SERVICE}/payments`, {
      bookingId,
      amount: tourInfo.price
    });

    // Step 5: Return result to Frontend
    res.json({
      success: true,
      message: 'Booking and payment successful!',
      tour: tourInfo,
      bookingId: bookingId,
      transactionId: paymentResponse.data.transactionId
    });

  } catch (error) {
    console.error('[Orchestrator] Flow failed:', error.message);
    if (error.response) {
      // Return the error from the downstream service
      res.status(error.response.status).json({
        success: false,
        message: `Booking failed: ${error.response.data.message || 'Service error'}`,
        step: error.config.url
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Booking failed due to internal service error'
      });
    }
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Orchestrator Service running on port ${PORT}`);
});
