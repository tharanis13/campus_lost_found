// routes/users.js
const express = require('express');
const router = express.Router();

// Basic route example
router.get('/', (req, res) => {
    res.json({ message: "Users route working!" });
});

module.exports = router;