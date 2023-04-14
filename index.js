const express = require("express");
const { check, validationResult } = require("express-validator"),
   cors = require("cors"),
   mongoose = require("mongoose"),
   Models = require("./models.js"),
   Movies = Models.Movie,
   Users = Models.User,
   app = express(),
   bodyParser = require("body-parser"),
   uuid = require("uuid"),
   morgan = require("morgan"),
   fs = require("fs"),
   path = require("path");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

mongoose.connect(process.env.CONNECTION_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
// mongoose.connect("mongodb://localhost:27017/test", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
// });

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
   flags: "a"
});

app.use(morgan("combined", { stream: accessLogStream }));

let users = [
   {
      Name: "Kimberly F.",
      Username: "Kim",
      Birthday: new Date("1983-01-23"),
      Email: "kim3925@gmx.com",
      FavoriteMovies: ["63d788aac8c69e520631d8e9", "63d7888ec8c69e520631d8e8"]
   },
   {
      Name: "Nick R.",
      Username: "NR",
      Birthday: new Date("1981-11-20"),
      Email: "nr4236@gmx.com",
      FavoriteMovies: ["63d7888ec8c69e520631d8e8", "63d78877c8c69e520631d8e7"]
   },
   {
      Name: "Jonathan J.",
      Username: "JJ",
      Birthday: new Date("1992-04-17"),
      Email: "joe9523@gmx.com",
      FavoriteMovies: ["63d78862c8c69e520631d8e6", "63d787c3c8c69e520631d8e2"]
   },
   {
      Name: "Jimmy A.",
      Username: "Jim",
      Birthday: new Date("1981-01-15"),
      Email: "jimmy9523@gmx.com",
      FavoriteMovies: ["63d787c3c8c69e520631d8e2", "63d78797c8c69e520631d8e1"]
   },
   {
      Name: "Mike L.",
      Username: "Micky",
      Birthday: new Date("2002-08-03"),
      Email: "lmike1239523@gmx.com",
      FavoriteMovies: ["63d788c1c8c69e520631d8ea", "63d788aac8c69e520631d8e9"]
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
         Birthday: "June 21, 1965",
         Movies:
            "The Matrix, The Matrix Reloaded, The Matrix Revolutions, V for Vendetta, Cloud Atlas, Jupiter Ascending"
      },
      Story:
         "A hacker follows a white rabbit and discovers the truth about his reality and his role in the war against its controllers."
   },
   {
      Title: "Inception",
      Year: "2010",
      Genre: {
         Name: "Thriller",
         Desription:
            "A genre that is designed to keep the audience on the edge of their seats with intense, suspenseful, and sometimes disturbing stories. They often involve crime, mystery, and the supernatural."
      },
      Director: {
         Name: "Christopher Nolan",
         Birthday: "July 30, 1970",
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
         Birthday: "February 22, 1944",
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
         Birthday: "October 31, 1961",
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
         Birthday: "August 16, 1954",
         Movies:
            "Piranha II: The Spawning, The Terminator, Aliens, The Abyss, Terminator 2: Judgment Day, True Lies, Titanic, Ghost of the Abyss, Avatar, Alita: Battle Angel"
      },
      Story:
         "A cyborg assassin is sent back in time to kill Sarah Connor, a woman whose unborn son will lead humanity in a war against machines."
   },
   {
      Title: "The Shawshank Redemption",
      Genre: {
         Name: "Drama",
         Description:
            "A genre of film that tells a story about human experiences and emotions that is often serious and realistic."
      },
      Year: "1994",
      Director: {
         Name: "Frank Darabont",
         Birthday: "January 28, 1959",
         Movies: "The Shawshank Redemption, The Green Mile, The Mist"
      },
      Story:
         "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
   },
   {
      Title: "The Godfather",
      Genre: {
         Name: "Crime",
         Description:
            "A genre of film that deals with illegal activities and the criminal world, often featuring organized crime and/or criminals as the main characters."
      },
      Year: "1972",
      Director: {
         Name: "Francis Ford Coppola",
         Birthday: "April 7, 1939",
         Movies:
            "The Godfather, The Godfather: Part II, Apocalypse Now, The Outsiders, The Cotton Club"
      },
      Story:
         "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
   },
   {
      Title: "Pulp Fiction",
      Genre: {
         Name: "Crime",
         Description:
            "A genre of film that deals with illegal activities and the criminal world, often featuring organized crime and/or criminals as the main characters."
      },
      Year: "1994",
      Director: {
         Name: "Quentin Tarantino",
         Birthday: "March 27, 1963",
         Movies:
            "Reservoir Dogs, Pulp Fiction, Jackie Brown, Kill Bill: Vol. 1, Kill Bill: Vol. 2, Inglourious Basterds, Django Unchained, The Hateful Eight"
      },
      Story:
         "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
   },
   {
      Title: "Goodfellas",
      Genre: {
         Name: "Crime",
         Description:
            "A genre of film that deals with illegal activities and the criminal world, often featuring organized crime and/or criminals as the main characters."
      },
      Year: "1990",
      Director: {
         Name: "Martin Scorsese",
         Birthday: "November 17, 1942",
         Movies:
            "Mean Streets, Taxi Driver, Raging Bull, The King of Comedy, Goodfellas, Casino, The Departed, The Wolf of Wall Street"
      },
      Story:
         "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate."
   },
   {
      Title: "Titanic",
      Genre: {
         Name: "Drama",
         Description:
            "A genre of film that tells a story about human experiences and emotions that is often serious and realistic."
      },
      Year: "1997",
      Director: {
         Name: "James Cameron",
         Birthday: "August 16, 1954",
         Movies:
            "The Terminator, Aliens, The Abyss, Terminator 2: Judgment Day, Titanic, Ghost of the Abyss, Avatar, Alita: Battle Angel"
      },
      Story:
         "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
   }
];

//CREATE
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

//CREATE A New User
app.post(
   "/users",
   [
      check("Username", "Username is required").isLength({ min: 5 }),
      check(
         "Username",
         "Username contains non alphanumeric characters - not allowed."
      ).isAlphanumeric(),
      check("Password", "Password is required")
         .not()
         .isEmpty(),
      check("Email", "Email does not appear to be valid").isEmail()
   ],
   (req, res) => {
      // check the validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() });
      }
      let hashedPassword = Users.hashPassword(req.body.Password);
      Users.findOne({ Username: req.body.Username })
         .then(user => {
            if (user) {
               return res
                  .status(400)
                  .send(req.body.Username + " already exists");
            } else {
               Users.create({
                  Name: req.body.Name,
                  Username: req.body.Username,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday,
                  Password: hashedPassword
               })
                  .then(user => {
                     const { Name, Username, Email } = user;
                     const userData = { Name, Username, Email };
                     res.status(201).json(userData);
                  })
                  .catch(error => {
                     console.error(error);
                     res.status(500).send("Error: " + error);
                  });
            }
         })
         .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
         });
   }
);

//UPDATE A User's Info By Username
app.put(
   "/users/:Username",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOneAndUpdate(
         { Username: req.params.Username },
         {
            $set: {
               Name: req.body.Name,
               Username: req.body.Username,
               Password: req.body.Password,
               Email: req.body.Email,
               Birthday: req.body.Birthday
            }
         },
         { new: true, select: "Name Username Password Email Birthday" },
         (err, updatedUser) => {
            if (err) {
               console.error(err);
               res.status(500).send("Error: " + err);
            } else {
               res.status(200).json(updatedUser);
            }
         }
      );
   }
);

//PATCH - Create A User Password
app.patch(
   "/users/:Username",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOneAndUpdate(
         { Username: req.params.Username },
         { Password: req.body.Password },
         { new: true },
         (err, updatedUser) => {
            if (err) {
               console.error(err);
               res.status(500).send("Error: " + err);
            } else {
               res.status(200).json(updatedUser);
            }
         }
      );
   }
);

//UPDATE Favorite Movies By Username And MovieID
app.post(
   "/users/:Username/movies/:MovieID",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOneAndUpdate(
         { Username: req.params.Username },
         {
            $push: { FavoriteMovies: req.params.MovieID }
         },
         { new: true, select: "Username FavoriteMovies" }, // This line makes sure that the updated document is returned
         (err, updatedUser) => {
            if (err) {
               console.error(err);
               res.status(500).send("Error: " + err);
            } else {
               res.status(200).json(updatedUser);
            }
         }
      );
   }
);

// Delete a key from a movie by ID
app.delete(
   "/movies/:movieId/:keyName",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      const movieId = req.params.movieId;
      const keyName = req.params.keyName;

      Movies.findById(movieId)
         .then(movie => {
            if (!movie) {
               return res
                  .status(404)
                  .send(`Movie with ID ${movieId} not found.`);
            }

            // Check if the key exists in the movie object
            if (!movie[keyName]) {
               return res
                  .status(404)
                  .send(
                     `Key ${keyName} not found in movie with ID ${movieId}.`
                  );
            }

            // Delete the key from the movie object and save to the database
            delete movie[keyName];
            movie
               .save()
               .then(updatedMovie => {
                  res.status(200).json(updatedMovie);
               })
               .catch(error => {
                  console.error(error);
                  res.status(500).send("Error: " + error);
               });
         })
         .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
         });
   }
);

//DELETE Movies From Users Favorite Movies By Username And MovieID
app.delete(
   "/users/:Username/:FavoriteMovies",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOneAndUpdate(
         {
            Username: req.params.Username
         },
         {
            $pull: { FavoriteMovies: req.params.FavoriteMovies }
         },
         { new: true, select: "Username FavoriteMovies" },
         (err, updatedUser) => {
            if (err) {
               console.error(err);
               res.status(500).send("Error: " + err);
            } else {
               res.status(200).json(updatedUser);
            }
         }
      );
   }
);

//DELETE User By Username
app.delete(
   "/users/:UserID",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOneAndRemove({ UserID: req.params.UserID })
         .then(user => {
            if (!user) {
               res.status(400).send(req.params.Username + " was not found");
            } else {
               res.status(200).send(req.params.Username + " was deleted.");
            }
         })
         .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
         });
   }
);

//READ
app.get("/", (req, res) => {
   res.status(200).send(
      '"The only true wisdom is in knowing you know nothing."- Socrates'
   );
});

//READ - GET All Movies
app.get(
   "/movies",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Movies.find()
         .then(movies => {
            res.status(200).json(movies);
         })
         .catch(error => {
            console.error(err);
            res.status(500).send("Error: " + err);
         });
   }
);

//READ - GET All Users
app.get(
   "/users",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.find({}, "Name Username Birthday Email")
         .then(users => {
            res.status(200).json(users);
         })
         .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
         });
   }
);

//READ - GET A User By Username
app.get(
   "/users/:Username",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Users.findOne(
         { Username: req.params.Username },
         "Name Username Email FavoriteMovies"
      )
         .then(user => {
            res.status(200).json(user);
         })
         .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
         });
   }
);

//READ - GET Movie Details By Title
app.get(
   "/movies/:Title",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      Movies.findOne({ Title: req.params.Title })
         .then(movie => {
            res.json(movie);
         })
         .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
         });
   }
);

// READ - GET Info About A Genre By Genrename
app.get(
   "/movies/genre/:genreName",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      const { genreName } = req.params;
      const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

      if (genre) {
         res.status(200).json(genre);
      } else {
         res.status(400).send("No such genre found!");
      }
   }
);

//READ - GET Infos About A Director By Name
app.get(
   "/movies/directors/:directorsName",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      const { directorsName } = req.params;
      const director = movies.find(
         movie => movie.Director.Name === directorsName
      ).Director;

      if (director) {
         res.status(200).json(director);
      } else {
         res.status(400).send("No such Director found!");
      }
   }
);

//READ - Get Documentation HTML
app.get("/documentation.html", (req, res) => {
   res.sendFile("public/documentation.html", {
      root: __dirname
   });
});

app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
   console.log("Listening on Port " + port);
});
