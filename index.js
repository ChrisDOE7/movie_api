const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
path = require ('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));


let topMovies = [
    {
        title: 'The Matrix',
        genre: 'SciFi',
        year: '1999'
    },
    {
        title: 'Inception',
        genre: 'Thriller',
        year: '2010'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        genre: 'Fantasy',
        year: '2003'
    },
    {
        title: 'The Terminator',
        genre: 'SciFi',
        year: '1984'
    },
    {
        title: 'The Silence of the Lambs',
        genre: 'Thriller',
        year: '1991'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        genre: 'Fantasy',
        year: '2001'
    },
    {
        title: 'Blade Runner',
        genre: 'SciFi',
        year: '1982'
    },
    {
        title: 'Jurassic Park',
        genre: 'SciFi',
        year: '1993'
    },
    {
        title: 'The Exorcist',
        genre: 'Thriller',
        year: '1973'
    },
    {
        title: 'Interstellar',
        genre: 'SciFi',
        year: '2014'
    },


];

app.get('/', (req, res) => {
    res.send('\"The only true wisdom is in knowing you know nothing.\"- Socrates')
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', {
        root: __dirname
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Aour app is listening to port 8080.');
});