const express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   uuid = require("uuid"),
   morgan = require("morgan"),
   fs = require("fs"),
   path = require("path");

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
   flags: "a"
});

app.use(morgan("combined", { stream: accessLogStream }));

let users = [
   {
      id: 1,
      name: "Kimberly F.",
      userName: "Kim",
      email: "kim3925@gmx.com,",
      favoriteMovies: []
   },
   {
      id: 2,
      name: "Jonathan J. ",
      userName: "JJ",
      email: "joe9523@gmx.com,",
      favoriteMovies: []
   }
];

let movies = [
   {
      Title: "The Matrix",
      Genre: {
         Name: "SciFi",
         Desription:
            "A genre that deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. It often explores the potential consequences of scientific, social, and technological innovations."
      },
      Year: "1999",
      Director: {
         Name: "The Wachowski Brothers",
         Birthdate: "June 21, 1965",
         Movies:
            "The Matrix, The Matrix Reloaded, The Matrix Revolutions, V for Vendetta, Cloud Atlas, Jupiter Ascending"
      },
      Story:
         "A hacker discovers the truth about his reality and his role in the war against its controllers."
   },
   {
      Title: "Inception",
      Year: "2010",
      Genre: {
         Name: "Thriller",
         Desription:
            " A genre that is designed to keep the audience on the edge of their seats with intense, suspenseful, and sometimes disturbing stories. They often involve crime, mystery, and the supernatural."
      },
      Director: {
         Name: "Christopher Nolan",
         Birthdate: "July 30, 1970",
         Movies:
            "Following, Memento, Insomnia, Batman Begins, The Prestige, The Dark Knight, Inception, The Dark Knight Rises, Interstellar, Dunkirk, Tenet"
      },
      Story:
         "A skilled extractor is offered a chance to regain his old life as payment for a task considered to be impossible."
   },
   {
      Title: "The Silence of the Lambs",
      Genre: {
         Name: "Thriller",
         Desription:
            " A genre that is designed to keep the audience on the edge of their seats with intense, suspenseful, and sometimes disturbing stories. They often involve crime, mystery, and the supernatural."
      },
      Year: "1991",
      Director: {
         Name: "Jonathan Demme",
         Birthdate: "February 22, 1944",
         Deathdate: "April 26, 2017",
         Movies:
            "Melvin and Howard, Swing Shift, Something Wild, Married to the Mob, The Silence of the Lambs, Philadelphia, Beloved"
      },
      Story:
         "An FBI agent is on the trail of a serial killer who skins his victims."
   },
   {
      Title: "The Lord of the Rings: The Return of the King",
      Genre: {
         Name: "Fantasy",
         Desription:
            "A genre that uses magic and other supernatural forms as a primary element of plot, theme, and/or setting. It often includes stories set in an imaginary world where magic is common, and often includes elements of mythology, legend, fairy tales and folklore. It can be set in the past, present or future, and often deals with themes of good versus evil."
      },
      Year: "2003",
      Director: {
         Name: "Peter Jackson",
         birthdate: "October 31, 1961",
         Movies:
            "Bad Taste, Meet the Feebles, Braindead, Heavenly Creatures, The Frighteners, The Lord of the Rings: The Fellowship of the Ring, The Lord of the Rings: The Two Towers, The Lord of the Rings: The Return of the King, King Kong, The Lovely Bones, The Hobbit: An Unexpected Journey, The Hobbit: The Desolation of Smaug, The Hobbit: The Battle of the Five Armies, Mortal Engines"
      },
      Story:
         "The final battle for Middle-earth begins as hobbits Frodo and Sam reach Mordor in their quest to destroy the One Ring, while Aragorn leads the forces of good against Sauron's evil army."
   },
   {
      Title: "The Terminator",
      Genre: {
         Name: "SciFi",
         Desription:
            "A genre that deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. It often explores the potential consequences of scientific, social, and technological innovations."
      },
      Year: "1984",
      Director: {
         Name: "James Cameron",
         birthdate: "August 16, 1954",
         Movies:
            "Piranha II: The Spawning, The Terminator, Aliens, The Abyss, Terminator 2: Judgment Day, True Lies, Titanic, Ghost of the Abyss, Avatar, Alita: Battle Angel"
      },
      Story:
         "A cyborg assassin is sent back in time to kill Sarah Connor, a woman whose unborn son will lead humanity in a war against machines."
   }
];

//CREATE
app.post("/users", (req, res) => {
   const newUser = req.body;

   if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser);
   } else {
      res.status(400).send("Users needs Names!");
   }
});

//UPDATE
app.put("/users/:id", (req, res) => {
   const { id } = req.params;
   const updatedUser = req.body;

   let user = users.find(user => user.id == id);

   if (user) {
      user.name = updatedUser.name;
      res.status(200).json(user);
   } else {
      res.status(400).send("No such User found!");
   }
});

//CREATE
app.post("/users/:id/:movieTitle", (req, res) => {
   const { id, movieTitle } = req.params;

   let user = users.find(user => user.id == id);

   if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(
         `${movieTitle} has been added to user ${id}'s array!`
      );
   } else {
      res.status(400).send("No such User found!");
   }
});
//DELETE
app.delete("/users/:id/:movieTitle", (req, res) => {
   const { id, movieTitle } = req.params;

   let user = users.find(user => user.id == id);

   if (user) {
      user.favoriteMovies = user.favoriteMovies.filter(
         title => title != movieTitle
      );
      res.status(200).send(
         `${movieTitle} has been removed from user ${id}'s array!`
      );
   } else {
      res.status(400).send("No such User found!");
   }
});

//DELETE
app.delete("/users/:id", (req, res) => {
   const { id } = req.params;

   let user = users.find(user => user.id == id);

   if (user) {
      users = users.filter(user => users.id !== id);
      res.status(200).send(`User ${id} has been deleted!`);
   } else {
      res.status(400).send("No such User found!");
   }
});

//READ
app.get("/", (req, res) => {
   res.status(200).send(
      '"The only true wisdom is in knowing you know nothing."- Socrates'
   );
});

//READ
app.get("/movies", (req, res) => {
   res.status(200).json(movies);
});
//READ
app.get("/users", (req, res) => {
   res.status(200).json(users);
});

//READ
app.get("/movies/:title", (req, res) => {
   const { title } = req.params;
   const movie = movies.find(movie => movie.Title === title);

   if (movie) {
      res.status(200).json(movie);
   } else {
      res.status(400).send("No such movie found!");
   }
});

//READ
app.get("/movies/genre/:genreName", (req, res) => {
   const { genreName } = req.params;
   const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

   if (genre) {
      res.status(200).json(genre);
   } else {
      res.status(400).send("No such genre found!");
   }
});

//READ
app.get("/movies/directors/:directorsName", (req, res) => {
   const { directorsName } = req.params;
   const director = movies.find(movie => movie.Director.Name === directorsName)
      .Director;

   if (director) {
      res.status(200).json(director);
   } else {
      res.status(400).send("No such Director found!");
   }
});

//READ
app.get("/documentation.html", (req, res) => {
   res.sendFile("public/documentation.html", {
      root: __dirname
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send("Something broke!");
});

app.listen(8080, () => {
   console.log("Aour app is listening to port 8080.");
});
