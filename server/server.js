const jsonServer = require('json-server');
const middleware = jsonServer.defaults();
const server = jsonServer.create();
const path = require('path');
const glob = require('glob');

const apiFiles = glob.sync(
    path.resolve(__dirname, './static') + '/**/[!_]*.js', {
        nodir: true
    }
)

server.use(middleware);
server.use(jsonServer.bodyParser);

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


server.listen(3000, () => {
    console.log('JSON server listening on port 3000');
});