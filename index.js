const express = require('express');
const cors = require('cors')
var configAuth = require('./config/auth');
const JWT = require('jsonwebtoken')

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// verify Access Token 
async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        var idToken = req.headers?.authorization?.split('Bearer ')[1]
        // console.log(idToken)
        try {
            const decoded = JWT.decode(idToken)
            decoded.client_id = configAuth.pingAuth.clientID
        } catch {
            res.status(401).json({
                message: "Not authorized."
            })
        }

    }
    next()
}



app.post('/users', verifyToken, async (req, res) => {
    res.json({
        "verify": "Verfied."
    })
})






// initial server setup
app.get('/', (req, res) => {
    res.send('Ping server running')
})
app.listen(port, () => console.log(`Port running on, ${port}`))