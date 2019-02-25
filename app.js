const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

const url = 'mongodb://Nick:SecWorkshop2@ds133202.mlab.com:33202/nasa-missions';

const databasename = 'nasa-missions';

MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log(err);
    }

    const db = client.db(databasename);

    app.get('/', (req, res) => {
        res.status(200).json({message: "Welcome to the NASA missions api"});
    });

    app.get('/missions', (req, res) => {
        db.collection('missions')
            .find()
            .toArray(function(err, docs) {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "Houston we have a problem"});
                } else {
                    res.status(200).json(docs);
                }
            });
    });

    app.post('/missions', (req, res) => {
        const mission = req.body;
        db.collection('missions')
            .insert(mission, 
                function(err, result) {
                    if(err) {
                        console.error(err);
                        res.status(500).json({message: "An error has occured"});
                    } else {
                        res.status(200).json(result);
                    }
                });
    });
    
    app.listen(9000, () => {
        console.log('NASA Server launched on port 9000');
    });
})
