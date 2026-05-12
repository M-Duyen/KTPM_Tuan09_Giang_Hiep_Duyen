const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const tours = [
  { id: 1, name: 'Da Nang - Hoi An 3 Days', price: 3000000, description: 'Beautiful tour', image: 'https://res.cloudinary.com/dk8gvar3y/video/upload/v1778556191/306068_r8ajvb.mp4' },
  { id: 2, name: 'Ha Long Bay 2 Days', price: 2500000, description: 'Cruising Ha Long Bay', image: 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1760002659/snapedit_1760002631640_fkoka9.jpg' },
  { id: 3, name: 'Phu Quoc Island 4 Days', price: 5000000, description: 'Relaxing beach vacation', image: 'https://res.cloudinary.com/dk8gvar3y/image/upload/v1759820893/BetterImage_1759820879438_apb0pb.jpg' }
];

app.get('/tours', (req, res) => {
  res.json(tours);
});

app.get('/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ message: 'Tour not found' });
  }
});

const PORT = 8082;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tour Service running on port ${PORT}`);
});
