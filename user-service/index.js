const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: 1, username: 'user1', password: 'password1', name: 'Nguyen Van A' },
  { id: 2, username: 'user2', password: 'password1', name: 'Tran Thi B' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password, ...userInfo } = user;
    res.json({ success: true, user: userInfo });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    const { password, ...userInfo } = user;
    res.json(userInfo);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
