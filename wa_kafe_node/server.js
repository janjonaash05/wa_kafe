const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cors = require('cors');
const app = express();

// CORS options to allow requests from frontend running on port 5500
const corsOptions = {
    origin: '*', // Allow only requests from this origin
    methods: 'GET,POST', // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
};

// Use CORS middleware with specified options
app.use(cors(corsOptions));






app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coffe_lmsoft_cz",
    port: 3306
});

conn.connect(function (err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
});


const PORT = 8083



app.get('/', authenticate, async (req, res) => {

    try {
        console.log(req.query)
        switch (req.query.cmd) {
            case "getPeopleList": getAll("people", (err, results) => { res.json(results) });
                break;

            case "getTypesList": getAll("types", (err, results) => { res.json(results) });
                break;


            case "getSummaryOfDrinks": getSummaryOfDrinks(req.query.month, (err, results) => {
                


                const arr = new Array();
                console.log("------------- ");
                for (e of results) {
                    console.log([e["typ"], e["pocet"], e["osoba"]]);
                    arr.push([e["typ"], e["pocet"], e["osoba"]]);
                }
                console.log("-------------");
                res.json(arr);

            });
                break;
            case "listCmd": res.json(["getPeopleList", "getTypesList", "saveDrinks", "getSummaryOfDrinks"])
                break;


        }
    } catch (err) {
        //res.status(500).send('Internal Server Error ' + err);
    }
});



app.post('/', authenticate, async (req, res) => {
    if (req.query.cmd == "saveDrinks") {

        console.log(Object.getOwnPropertyNames(req.body));


        saveDrinks(req.body.user, req.body["type[]"], (err) => {res.send("1")});

    }
});



function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader) res.status(401).send("Unathorized");




    const login = Buffer.from(authHeader.split(' ')[1], "base64").toString();
    console.log(login);
    const username = login.split(":")[0];
    const password = login.split(":")[1];


    console.log(username + " " + password);
    if (username != "coffe" || password != "kafe") {
        res.status(401).send("Unathorized");
        return;
    }

    next()
}


function getAll(tablename, callback) {
    let res;
    conn.query('SELECT * FROM ' + tablename, (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        callback(err, results)

    });
}

function getSummaryOfDrinks(month, callback) {


    let query = "SELECT types.typ, count(drinks.ID) as pocet,people.name as osoba FROM `drinks` JOIN people on drinks.id_people=people.ID JOIN types on drinks.id_types=types.ID";
    if (month > 0 && month < 13) {
        query += " WHERE MONTH( `date` ) = " + month;
    }
    query += " group by types.typ"




    let res;
    conn.query(query, (err) => {
        if (err) {

            console.log(results);
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        console.log(results);
        callback(err, results)

    });
}




function saveDrinks(id_people, drinks, callback) {
    let date_time = new Date();
    const date = date_time.getFullYear() + "-" + (date_time.getMonth()+1) + "-" + date_time.getDate();
    let query = `INSERT INTO DRINKS(date, id_people, id_types) values `;

    for (let i = 0; i < drinks.length; i++) {
        for (let j = 0; j < drinks[i]; j++) {
            
            query += `${(i==0 && j==0) ? "":","}('${date}',${id_people},${i+1}) `
        }
    }

    console.log(query);

    conn.query(query) ,(err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
            return;
        }
        console.log(results);
        callback(err, results)
}
}






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});