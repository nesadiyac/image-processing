const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fileupload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');
const app = express();
var bodyParser = require('body-parser');
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(fileupload());
app.get('', (req, res) => {
    res.render('compressor', {
        title: 'Free Image Processing'
    })
})
app.get('/resize', (req, res) => {
    res.render('index', {
        title: 'Free Image Processing'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Free Image Processing'
    })
})
const jsonParser = bodyParser.json()
app.post('/uploadImage', jsonParser, (req, res) => {
    const fileName = req.body.fileName;
    const path = __dirname + '/download/' + fileName;
    let imgBuffer =  Buffer.from(req.body.data.split(',')[1], 'base64');
    fs.writeFileSync(path, imgBuffer);
    sharp(imgBuffer)
    .resize(req.body.dimension.width || undefined, req.body.dimension.height || undefined)
    .toFile(path, (err, info) => { 
            fs.readFile(path,  (err, content) => {
               
                if (err) {
                   
                } else {
                    res.writeHead(200,{'Content-type':'application/json'});
                    res.end(JSON.stringify({imgSrc: req.body.data.split(',')[0]+ ',' + content.toString('base64')}));
                }
            })
        fs.unlinkSync(path);
        
   });
  })

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})