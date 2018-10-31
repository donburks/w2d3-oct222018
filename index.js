const express = require('express');
const bodyParser = require('body-parser');
//Would need to use method-override npm for PUT, PATCH, DELETE

const app = express();

const sauces = [
  { id: 1, name: "alfredo", image: "https://c1.staticflickr.com/9/8148/7649047348_a7ab6a1b56_b.jpg" },
  { id: 2, name: "tomato", image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Spaghetti-prepared.jpg" },
  { id: 3, name: "weak", image: "https://c1.staticflickr.com/8/7170/6718805045_9b6372af65_b.jpg" }
];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  const pattern = /^\/sauces\/(\d+)/;
  if (pattern.test(req.path)) {
    const results = req.path.match(pattern);
    req.sauceId = results[1];
    req.sauceIndex = sauces.findIndex(sauce => sauce.id == req.sauceId);
    req.sauce = sauces[req.sauceIndex];
  }

  next();
});

//Browse
app.get('/sauces', (req, res) => {
  let templateVars = { sauces };
  res.render('sauces', templateVars); 
});

//Add
app.post('/sauces', (req, res) => {
  //const { name, image } = req.body;
  const name = req.body.name;
  const image = req.body.image;

  const lastId = sauces[sauces.length - 1].id;
  const newSauce = {id: lastId + 1, name, image};
  sauces.push(newSauce);

  res.redirect('/sauces/'+ (lastId + 1));
});

//Add
app.get('/sauces/new', (req, res) => {
  let templateVars = {
    sauce: undefined,
    action: "/sauces"
  };
  res.render('sauceForm', templateVars);
});

//Read
app.get('/sauces/:id', (req, res) => {
  /*
  const id = req.params.id;
  let templateVars = {sauce: null};
  for (let i = 0; i < sauces.length; i++) {
    if (sauces[i].id == id) {
      templateVars.sauce = sauces[i];
    }
  }
 */

  let templateVars = {sauce: req.sauce};

  if (templateVars.sauce) {
    res.render('sauce', templateVars);
  } else {
    res.status(404);
    res.render('noSauce');
  }
});

//Edit
app.post('/sauces/:id', (req, res) => {
  const id = req.params.id;
  const {name, image} = req.body;
  //Here, I could use my middleware and access req.sauceIndex
  const index = sauces.findIndex(sauce => sauce.id == id);
  sauces[index].name = name;
  sauces[index].image = image;

  res.redirect('/sauces/'+id);
});

//Edit
app.get('/sauces/:id/edit', (req, res) => {
  let templateVars = {
    //I could use middleware here
    sauce: sauces.find(sauce => sauce.id == req.params.id),
    action: "/sauces/"+req.params.id
  };

  res.render('sauceForm', templateVars);
});

//Delete
app.get('/sauces/:id/delete', (req, res) => {
  //Moar middleware! see all the work it saves me?
  const id = req.params.id;
  const index = sauces.findIndex(sauce => sauce.id == id);
  sauces.splice(index, 1);

  res.redirect('/sauces'); 
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
