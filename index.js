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

let movies = [];

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
         { new: true, select: "Name Username Birthday Email" },
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
app.get("/movies", (req, res) => {
   Movies.find()
      .then(movies => {
         res.status(200).json(movies);
      })
      .catch(error => {
         console.error(err);
         res.status(500).send("Error: " + err);
      });
});

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
