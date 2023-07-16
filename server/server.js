const jsonServer = require('json-server');
const multer = require('multer');
const middleware = jsonServer.defaults();
const server = jsonServer.create();
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const cors = require('cors');

const upload = multer({ dest: path.resolve(__dirname,'./uploads/') });

const apiFiles = glob.sync(
    path.resolve(__dirname, './static') + '/**/[!_]*.js', {
        nodir: true
    }
)

// Enable CORS
server.use(cors()); 

// Exclude the file upload route from the bodyParser middleware
server.use((req, res, next) => {
    const isDownload = req.path.indexOf('download') > -1;
    if (req.path === '/upload' || isDownload || '/v1/content-creators/max/profile-image') {
      next();
    } else {
      jsonServer.bodyParser(req, res, next);
    }
  });

// Middleware to handle file uploads
server.use(upload.single('file'));

apiFiles.forEach(filePath => {
    const api = require(filePath);
    let [, url] = filePath.split('static/');
    url = '/' +  url.slice(0, url.length - 3);

    server.get(url, (req, res) => res.send(api));
    server.put(url, (req, res) => res.send(api));
    server.delete(url, (req, res) => res.send(api));
    server.post(url, (req, res) => res.send(api));
    server.patch(url, (req, res) => res.send(api));
});

server.get('/v1/content-creators', (req, res) => {
    const searchTerm = req.query.searchTerm.toLowerCase();
    if (searchTerm === 'error') {
        res.status(500).send();
        return;
    }
    if (searchTerm === '10') {
        res.status(200).send(require('./fixtures/creators-result-10.json'));
        return;
    }
    if (searchTerm === '17') {
        res.status(200).send(require('./fixtures/creators-result-17.json'));
        return;
    }
    if (searchTerm === '100') {
        res.status(200).send(require('./fixtures/creators-result-100.json'));
        return;
    }
    if (searchTerm === '1000') {
        res.status(200).send(require('./fixtures/creators-result-1000.json'));
        return;
    }
    if (searchTerm === 'noresults') {
        res.status(200).send([]);
        return;
    }
    if (searchTerm === 'delay') {
        setTimeout((() => {
            res.status(200).send(require('./fixtures/creators-result-default.json'));
          }), 2000);
        return;
    }
    res.status(200).send(require('./fixtures/creators-result-default.json'));
});

server.get('/v1/content-creators/:userName', (req, res) => {
    const userName = req.params.userName.toLowerCase();
    if (userName === 'error') {
        res.status(500).send();
        return;
    }
    if (userName === 'notfound') {
        res.status(404).send();
        return;
    }
    if (userName === 'delay') {
        setTimeout((() => {
            res.status(200).send(require('./fixtures/creator.json'));
          }), 2000);
        return;
    }
    res.status(200).send(require('./fixtures/creator.json'));
});

server.post('/v1/content-creators', (req, res) => {
    const userName = req.body.userName;
    if (userName === 'userNameTaken') {
        res.status(409).send();
        return;
    }
    if (userName === 'max90') {
        res.setHeader('Location', `http://localhost:3000/v1/content-creators/${userName}`);
        res.status(201).send();

        return;
    }
    res.status(500).send();
});

server.patch('/v1/content-creators/max/user-name', (req, res) => {
    const userName = req.body.userName;
    if (userName === 'max409') {
        res.status(409).send();
        return;
    }
    res.status(200).send(
        require('./static/v1/content-creators/max90/user-name')
    );
});

server.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName.toLowerCase();
    console.log(fileName);
    // const file = fs.readFileSync(`${__dirname}/uploads/${fileName}`)
    res.download(`${__dirname}/uploads/${fileName}`);
})

server.post('/v1/users/profile/image', (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
  
    // Store the file reference in the JSON data
    const file = {
      id: Date.now(),
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
    };

    const user = require(`./static/v1/users/profile`);
    user.imagePath = `http://localhost:${port}/download/${file.filename}`;
  
    res.status(200).send(user);
  })

server.post('/v1/content-creators/:userName/profile-image', (req, res) => {
    const userName = req.params.userName.toLowerCase();
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
  
    // Store the file reference in the JSON data
    const file = {
      id: Date.now(),
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
    };

    const user = require(`./static/v1/content-creators/max90/user-name`);
    user.imagePath = `http://localhost:${port}/download/${file.filename}`;
  
    res.status(200).send(user);
  });



server.use(middleware);

const port = 3000;
server.listen(port, () => {
    console.log('JSON server listening on port 3000');
});