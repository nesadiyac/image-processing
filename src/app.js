const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fileupload = require('express-fileupload');
const fs = require('fs');
const sharp = require('sharp');
const app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
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
const port = process.env.PORT || 3000;
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(fileupload());
app.get('/', (req, res) => {
    res.render('index', {
        title: 'compressor'
    })
})
app.get('/resize', (req, res) => {
    res.render('resize', {
        title: 'image-resize'
    })
})
app.get('/rotate', (req, res) => {
    res.render('rotate', {
        title: 'image-rotate'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about'
    })
})
app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {
        title: 'Free Image Processing'
    })
})
app.get('/sitemap', (req, res) => {
    res.sendFile(__dirname + '/download/sitemap.xml');
})
const jsonParser = bodyParser.json()
app.post('/resizeImg', jsonParser, (req, res) => {
    let imgBuffer =  Buffer.from(req.body.data.split(',')[1], 'base64');
    sharp(imgBuffer)
    .resize(req.body.dimension.width || undefined, req.body.dimension.height || undefined)
    .toBuffer().then(data => {
    
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify({imgSrc: req.body.data.split(',')[0]+ ',' + data.toString('base64')}));
        
    })
})
app.post('/rotateImg', jsonParser, (req, res) => {
    let imgBuffer =  Buffer.from(req.body.data.split(',')[1], 'base64');
    sharp(imgBuffer)
    .rotate(req.body.rotate || 180, {background: req.body.background ? req.body.background : 'transparent'})
    .toBuffer().then(data => {
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify({imgSrc: req.body.data.split(',')[0]+ ',' + data.toString('base64')}));
    })
})
app.post('/editImg', jsonParser, (req, res) => {
    const fileName = req.body.fileName;
    const path = __dirname + '/download/' + fileName;
    let imgBuffer =  Buffer.from(req.body.data.split(',')[1], 'base64');
    fs.writeFileSync(path, imgBuffer);
    sharp(imgBuffer)
    .rotate(req.body.rotate || 180, {background: req.body.background ? req.body.background : 'transparent'})
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
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})