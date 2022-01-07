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

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(fileupload());
app.get('', (req, res) => {
    //fs.writeFileSync('visitor.txt', '1');
    fs.readFile('visitor.txt', {encoding:'utf8', flag:'r'}, (err, count) => {
        if (count) {
            fs.writeFileSync('visitor.txt', (++count).toString());
        }
        if (err) {
            fs.writeFileSync('visitor.txt', '1');
        }
    })
    res.render('compressor', {
        title: 'Free Image Processing'
    })
})
app.get('/resize', (req, res) => {
    res.render('index', {
        title: 'Free Image Processing'
    })
})
app.get('/rotate', (req, res) => {
    res.render('rotate', {
        title: 'Free Image Processing'
    })
})
app.get('/free-editor', (req, res) => {
    res.render('freeEditor', {
        title: 'Free Image Processing'
    })
})
const jsonParser = bodyParser.json()
app.post('/resizeImg', jsonParser, (req, res) => {
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
app.post('/rotateImg', jsonParser, (req, res) => {
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
setInterval(() => {
    fs.readFile('visitor.txt', {encoding:'utf8', flag:'r'}, (err, count) => {
        if (count) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'chirag.uiengineer@gmail.com',
                  pass: 'hmseskjklcwhlvjo'
                }
              });
              
              var mailOptions = {
                from: 'chirag.uiengineer@gmail.com',
                to: 'nesadiyac@gmail.com',
                subject: 'Sending Email using Node.js',
                text: `Total visitors on ${new Date().toDateString()} are ${count}`
              };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
    })
    fs.writeFileSync('visitor.txt', '1');
}, 1000 * 60 * 60 * 24);

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})