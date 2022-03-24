const express = require('express');
const cors = require('cors')
var passport = require('passport');
var OAuth2Strategy = require('passport-ping-oauth2').Strategy;
var configAuth = require('./config/auth');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// verify Access Token 
async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        let idToken = req.headers?.authorization?.split('Bearer ')[1]
        console.log(idToken)
        passport.use(new OAuth2Strategy({
            authorizationURL: configAuth.pingAuth.authorizationURL,
            tokenURL: configAuth.pingAuth.tokenURL,
            clientID: configAuth.pingAuth.clientID,
            clientSecret: configAuth.pingAuth.clientSecret,
            callbackURL: configAuth.pingAuth.callbackURL
        },
            function (idToken, refreshToken, params, profile, done) {

                User.findOne({ 'ping.id': profile.cn }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.ping.id = profile.id;
                        newUser.ping.token = idToken;
                        newUser.ping.name = profile.displayName;
                        newUser.ping.email = profile.email;
                        newUser.save(function (err) {
                            console.log(newUser)
                            if (err) { throw err; }
                            return done(null, newUser);
                        });
                    }
                });
            }));
    }
    next()
}


app.post('/users', verifyToken, async (req, res) => {
    console.log('success')
})







// initial server setup
app.get('/', (req, res) => {
    res.send('Ping server running')
})
app.listen(port, () => console.log(`Port running on, ${port}`))