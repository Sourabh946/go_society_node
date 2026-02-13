require('dotenv').config({ quiet: true });
const express = require("express");
const cors = require("cors");

const app = express();

const auth = require('./middlewares/auth.middleware');
const role = require('./middlewares/role.middleware');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.static("public"));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/societies', require('./routes/society.routes'));
app.use('/api/buildings', require('./routes/building.routes'));
app.use('/api/flats', require('./routes/flat.routes'));
app.use('/api/members', require('./routes/member.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.use(require('./middlewares/error.middleware'));

app.get('/', (req, res) => {
    res.send('Society Maintenance API running');
});

app.get('/api/admin/dashboard',
    auth,
    role('Admin'),
    (req, res) => {
        res.json({ message: 'Welcome Admin' });
    }
);


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});