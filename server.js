
// import {usersToUpload} from '1Users-List.js'
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')


// const userService = require('./services/user-service')
const carService = require('./services/1OLDcar-service')
const storyService = require('./services/story-service')
const userService = require('./services/user-service')
const app = express()
const port = 3000



// Express App Configuration
// We ask Express.js to serve static files from the 'public' folder
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())






// app.use(session({
//     secret: 'some secret token',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
//  }))
 

// app.get('/puki', (req, res) => {
//     var visitCount = req.cookies.visitCount || 0;
//     visitCount++;
//     res.cookie('visitCount', visitCount)

//     res.send('Hello Puki')
// })
// app.get('/nono', (req, res) => res.redirect('/puki'))

 
// app.post('/saveImg', (req, res) => {
// console.log(req)
// res.json({id: 11111,
//           name: 'Homer Simpson',
//         })
// } 
// )











//LOGIN
app.post('/login', (req, res) => {
    const credentials = req.body;
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                req.session.loggedinAt = Date.now();
                req.session.loggedinUser = user;
                res.json(user);
            } else {
                res.status(401).send('Please login')
            }
        })
})
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.end();
})

app.post('/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
                req.session.loggedinAt = Date.now();
                req.session.loggedinUser = user;
                res.json(user)
        })
})

// The Car API

// CAR List
app.get('/api/car', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        pageIdx: req.query.pageIdx || 0
    }
    carService.query(filterBy)
        .then(cars => res.json(cars))
})

// CAR Read single
app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params
    carService.getById(carId)
        .then(car => {
            res.json(car)
        })
})


// CAR Create
app.post('/api/car', (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) return res.status(401).send('Please login');
    const { vendor, maxSpeed } = req.body
    const car = {
        owner: {_id: loggedinUser._id, fullname : loggedinUser.fullname},
        vendor,
        maxSpeed,
    }
    carService.save(car, loggedinUser)
        .then(savedCar => {
            console.log('savedCar:', savedCar)
            res.json(savedCar)
        })
})

// CAR Update
app.put('/api/car', (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) return res.status(401).send('Please login');

    const { _id, vendor, maxSpeed } = req.body
    const car = {
        _id,
        vendor,
        maxSpeed,
        owner: {_id: loggedinUser._id, fullname : loggedinUser.fullname},
    }
    carService.save(car, loggedinUser)
        .then(savedCar => {
            res.json(savedCar)
        })
        .catch(err => {
            console.log('Cannot save car:', car, err);
            res.status(403).send('Cannot save car');
        })
})

// CAR Delete
app.delete('/api/car/:carId', (req, res) => {
    const { loggedinUser } = req.session;
    if (!loggedinUser) return res.status(401).send('Please login');

    const { carId } = req.params
    carService.remove(carId, loggedinUser)
        .then(() => {
            res.json('Done!')
        })
        .catch(err => {
            console.log('Cannot remove car:', carId, err);
            res.status(403).send('Cannot delete car');
        })
})


app.listen(port, () => {
    console.log(`My app listening at http://localhost:${port}`)
})








// ====================================================================
// ====================================================================
// =====================================================================

const usersToUpload = [
    {
        // id: 'u11111', MongoDB will give _id
        username: 'HomerS',
        password: 'homesimpsonpassword',
        fullname: 'Homer Simpson',
        profileText: 'Hi everybody, Homer Simpson here, I live in Springfield USA with my wife Marge and our kids Bart, Lisa and Maggie',
        profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445913/Homer%20Simpson/Homer_Simpson_2006_veqnka.png',
        oldProfileImgs: [
            // this array will contain urls -- strings only
        ],
        following: [
            // this array will contain ids -- strings only
        ],
        followers: [
            // this array will also contain ids -- strings only
        ],
        ownedStories: [
            // this array will also contain ids -- strings only
        ],
    },
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Lt_Uhura',
    password: 'ltuhurapassword',
    fullname: 'Nyota Uhura',
    profileText: 'I\'m Lieutenant Uhura of Starfleet, chief communications officer of the USS Enterprise',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445984/Nyota%20Uhura/Nichelle_Nichols__NASA_Recruiter_-_GPN-2004-00017_gtpazg.jpg',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Wolverine',
    password: 'wolverinepassword',
    fullname: 'James Logan Howlett',
    profileText: 'I\'m the best there is at what I do, and what I do isn\'t very nice. Originally from Canada, now live in NY state. Well traveled',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445997/Wolverine/Wolverine__James__Logan__Howlett_ijn1tu.png',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Spider-Man',
    password: 'spidermanpassword',
    fullname: 'Peter Parker',
    profileText: 'Hello Hello, your friendly neighborhood wall-crawler here, trying to do what I can every day. Originally from Queens, NYC, married to Gwen Stacy',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445937/Spider-Man/Web_of_Spider-Man_Vol_1_129-1_wps1tt.png',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Superman',
    password: 'supermanpassword',
    fullname: 'Clark Kent',
    profileText: 'Former small-town farmboy trying to do what\' right and help people if I can. Reporter for the Daily Planet, Metropolis',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445986/Superman/Supermanflying_q6bprf.png',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Bugs_Bunny',
    password: 'bugsbunnypassword',
    fullname: 'Bugs Bunny',
    profileText: 'What\'s up, docs? Longtime favorite Bugs here, representing the whole Looney Tunes crew',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445914/Bugs%20Bunny/Bugs_Bunny_qwdwtt.svg',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Super_Mario',
    password: 'supermariopassword',
    fullname: 'Mario Mario',
    profileText: 'It\'s a-me, Mario! Just a humble plumber who occasionally eats a star to become invincible for a short while. Bro to Luigi, spouce to Peach, friend to Yoshi and others',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445952/Super%20Mario/MarioNSMBUDeluxe_o9m18v.png',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Godfather_Corleone',
    password: 'godfatherpassword',
    fullname: 'Vito Corleone',
    profileText: 'it\'s not personal, strictly business. If you must use strength, do so -- but if I can, I prefer to deal with friends',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445991/Vito%20Corleone/Godfather15_flip_rurkpq.jpg',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Yoda',
    password: 'yodapassword',
    fullname: 'Yoda',
    profileText: 'Jedi master, I am. Trained some of the most important characters in Star Wars, I surely have. With you, may the Force be',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628446011/Yoda/Yoda_Empire_Strikes_Back_z5ed0w.png',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},
//=============================================================================================================
{
    // id: 'u11111', MongoDB will give _id
    username: 'Wonder_Woman',
    password: 'wonderwomanpassword',
    fullname: 'Diana Prince',
    profileText: 'Greetings, my name Is Diana. Amazon (not the internet-company, the ancient women\'s warrior group) who fights for (and believes in) the good of humanity',
    profileImgUrl: 'https://res.cloudinary.com/asaphstagram2021/image/upload/v1628445998/Wonder%20Woman/Wonder_Woman_fp43lf.jpg',
    oldProfileImgs: [
        // this array will contain urls -- strings only
    ],
    following: [
        // this array will contain ids -- strings only
    ],
    followers: [
        // this array will also contain ids -- strings only
    ],
    ownedStories: [
        // this array will also contain ids -- strings only
    ],
},

]





console.log(usersToUpload)
storyService.uploadUsers(usersToUpload)

