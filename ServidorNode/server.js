const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/alumno') {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Alumno: Dana, Comisión: DWN4AV');
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Servidor funcionando</h1>');
    }
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
