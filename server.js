const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var offline = false;
var app = express();

hbs.registerPartials(__dirname+'/views/partials');
hbs.registerHelper('getcurrentyear', ()=>{
  return new Date().getFullYear();
});
hbs.registerHelper('screamit', (text)=>{
  return text.toUpperCase();
});


app.set('view engine', 'hbs');

app.use((request,response,next)=>{
  var now = new Date().toString();
  var log = `${now}: ${request.method} ${request.url}`;
  fs.appendFile( 'server.log',log + '\n', (error)=>{
    if(error) console.log("unable to append to server.log");
  } );
  next();
});

if(offline) {
  app.use( (request,response,next) =>{
    response.render('offline.hbs');
  } );
}

app.use(express.static(__dirname+'/public'));

app.get('/', ( request, response )=>{
  var template_data = {
    welcomemsg: "hello there",
    pagetitle: "home page"
  }
  response.render('home.hbs', template_data);
})

app.get('/about', (request, response)=>{
  var template_data = {
    pagetitle: "about page"
  }
  response.render('about.hbs', template_data);
});

app.get('/bad', (request,response)=>{
  response.send({errormessage:"failed"});
})

app.listen(port, ()=>{
  console.log(`server is online - ${port}`);
});
