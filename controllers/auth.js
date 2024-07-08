const router = require("express").Router();
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if(username === 'user' && password === 'pass'){
        const token = jwt.sign
        (
            { username: username },
            process.env.SECRET,
            { expiresIn: 3600 }
        );
        res.json({ auth: true, token: token });
    }
    else{
        res.status(401).json({ auth: false, token: null });
    }
});

module.exports = router;