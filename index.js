const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ReplSet } = require('mongodb')
const app = express();

const uri = "mongodb+srv://yoda:yoda123@cluster0.02hcg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const databaseClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

databaseClient.connect((err, client) => {
    if (err) {
        return console.error(err);
    }
    console.log('connected to the database');

    // changing the database
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    // adding the handles inside the mongo connect to access the DB

    // adding template engine, this instructs express that we are using template engines to control the view
    // needs to be added before any middleware
    app.set('view engine', 'ejs');

    // add middleware to use JS in public folder
    app.use(express.static('public'));

    // telling our server to accept JSON data
    app.use(bodyParser.json());

    // adding middleware to parse form data, should be added before all the handlers
    app.use(bodyParser.urlencoded({extended: true}));
    
    // GET request on '/'
    app.get('/', (req, res) => {
        // res.sendFile(__dirname + '/index.html');

        db.collection('quotes').find().toArray()
        .then(result => {
            console.log(result);
            res.render('index.ejs', { quotes: result })
        })
        .catch(error => {
            console.error(error);
        })
    })
    
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/');
        })
        .catch(error => {
            console.error(error);
        })
        console.log(req.body);
    })

    // implemening update
    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                // if the quote is not present, it adds it anyway
                upsert: true
            }
        ).then(result => {
            res.json('Success');
        }).catch(error => {
            console.error(error);
        })
    })

    // implementing delete
    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            { name: req.body.name }
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete');
            }
            res.json(`Deleted Darth Vader's quotes`);
        })
        .catch(error => {
            console.error(error);
        })
    })
    
    // make the server listen on port 3000
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })

})

// console.log('Dirname', __dirname);
