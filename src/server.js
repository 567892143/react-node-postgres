//server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'customers',
    password: 'dinesh2003',
    port: 5432,
});


app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
