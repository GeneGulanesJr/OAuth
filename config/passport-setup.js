const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const SpotifyStrategy = require('passport-spotify').Strategy;
const SteamStrategy = require('passport-steam').Strategy;
const twitchStrategy = require('passport-twitch-new').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done)=>{
    done(null, user.id); // A piece of info and save it to cookies
});

passport.deserializeUser((id, done)=>{
    //Who's id is this?
    User.query(`select row_to_json (u) from ( SELECT "oauth".findById(${id}) as user) u;`,(err,res)=>{
        if(err){
            console.log(err);
        }else{                        
            const user = res.rows[0].row_to_json.user;
            console.log(">>>> deserializeUser >>>>> ",user);
            done(null, user); 
        }        
    });
});







passport.use(
    new GoogleStrategy({
        // options for the google strat
        callbackURL: 'http://gulanesoauth.herokuapp.com/auth/google/callback',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done)=>{
        // check if user already exists in our database
        console.log('##########################');
        console.log(profile);


        User.query(`CALL "oauth".insert_when_unique(${profile.id},
                                                    '${profile.displayName}',
                                                    '${profile.photos[0].value}');`,
                    (err,res)=>{
                        console.log(">>>>>>>>>>>>>>>>>>>>>>");
                        const _user = {
                            id: profile.id,
                            name: profile.displayName,                                
                            picture: profile.photos[0].value
                        };

                        if(err){
                            //already have the user
                            const currentUser = _user;
                            console.log('User is ', JSON.stringify(currentUser));
                            done(null, currentUser);
                            //console.log(err);
                        }else{
                            //if not, new user was created in our db
                            const newUser = _user;
                            console.log('New User created: ' + JSON.stringify(newUser));
                            done(null, newUser);
                            // console.log(res.rows[0]);
                        }
                    });


    })
);

passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "http://gulanesoauth.herokuapp.com/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
        User.query(`CALL "oauth".insert_when_unique(${profile.id},
        '${profile.displayName}',
        '${profile.photos[0].value}');`,
            (err,res)=>{
                console.log(">>>>>>>>>>>>>>>>>>>>>>");
                const _user = {
                    id: profile.id,
                    name: profile.displayName,
                    picture: profile.photos[0].value
                };

                if(err){
                    //already have the user
                    const currentUser = _user;
                    console.log('User is ', JSON.stringify(currentUser));
                    cb(null, currentUser);
                    console.log(err);
                }else{
                    //if not, new user was created in our db
                    const newUser = _user;
                    console.log('New User created: ' + JSON.stringify(newUser));
                    cb(null, newUser);
                    console.log(res.rows[0]);
                }
            });
    }
));

passport.use(
    new SpotifyStrategy(
        {
            clientID: keys.spotify.clientID,
            clientSecret: keys.spotify.clientSecret,
            callbackURL: "http://gulanesoauth.herokuapp.com/auth/spotify/callback"

        },
        function(accessToken, refreshToken, expires_in, profile, done) {
            console.log(profile)
            var x;
            var str = "";
            var temp = profile.id;
            for(var i=0;i<temp.length;i++){
                var x = temp.charCodeAt(i);
                str += x;
            }
            if(profile.photos[0]==undefined){
                x ="https://i.imgur.com/sy5Jpzd.jpg";
            }else{
                x = profile.photos[0].value;
            }
            var xd = parseInt(str);

            User.query(`CALL "oauth".insert_when_unique(${xd},
                    '${profile.displayName}',
                    '${x}');`,
                (err,res)=>{
                    console.log(">>>>>>>>>>>>>>>>>>>>>>");
                    const _user = {
                        id: xd,
                        name: profile.displayName,
                        picture: x
                    };

                    if(err){
                        //already have the user
                        const currentUser = _user;
                        console.log('User is ', JSON.stringify(currentUser));
                        done(null, currentUser);
                        //console.log(err);
                    }else{
                        //if not, new user was created in our db
                        const newUser = _user;
                        console.log('New User created: ' + JSON.stringify(newUser));
                        done(null, newUser);
                        // console.log(res.rows[0]);
                    }
                });
        }
    )
);

passport.use(new SteamStrategy({
        returnURL: 'http://gulanesoauth.herokuapp.com/auth/steam/callback',
        realm: 'http://localhost:3000/',
        apiKey: '5273DA83FD3722289504AC44A40D65D8',
    },
    (identifier, profile, done)=>{
        // check if user already exists in our database
        console.log('##########################');
        console.log(profile);
        User.query(`CALL "oauth".insert_when_unique(${profile.id},
                                                    '${profile.displayName}',
                                                    '${profile.photos[2].value}');`,
            (err,res)=>{
                console.log(">>>>>>>>>>>>>>>>>>>>>>");
                const _user = {
                    id: profile.id,
                    name: profile.displayName,
                    picture: profile.photos[2].value
                };

                if(err){
                    //already have the user
                    const currentUser = _user;
                    console.log('User is ', JSON.stringify(currentUser));
                    done(null, currentUser);
                    //console.log(err);
                }else{
                    //if not, new user was created in our db
                    const newUser = _user;
                    console.log('New User created: ' + JSON.stringify(newUser));
                    done(null, newUser);
                    // console.log(res.rows[0]);
                }
            });


    })
);

passport.use(new twitchStrategy({
        clientID: keys.twitch.clientID,
        clientSecret: keys.twitch.clientSecret,
        callbackURL: "http://127.0.0.1:3000/auth//twitch/callback",
        scope: "user_read"
    },
    (accessToken, refreshToken, profile, done)=>{
        // check if user already exists in our database
        console.log('##########################');
        console.log(profile);
        User.query(`CALL "oauth".insert_when_unique(${profile.id},
                                                    '${profile.username}',
                                                    '${profile.displayName}');`,
            (err,res)=>{
                console.log(">>>>>>>>>>>>>>>>>>>>>>");
                const _user = {
                    id: profile.id,
                    name: profile.username,
                    picture: profile.displayName
                };

                if(err){
                    //already have the user
                    const currentUser = _user;
                    console.log('User is ', JSON.stringify(currentUser));
                    done(null, currentUser);
                    //console.log(err);
                }else{
                    //if not, new user was created in our db
                    const newUser = _user;
                    console.log('New User created: ' + JSON.stringify(newUser));
                    done(null, newUser);
                    // console.log(res.rows[0]);
                }
            });


    })
);





