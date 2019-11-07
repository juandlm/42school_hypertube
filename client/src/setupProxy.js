const proxy = require('http-proxy-middleware');

// petit hack du futur : proxy la requete vers le serveur avec le header d'autorisation
// c'est tricky, mais ca marche :
// - on a plu besoin de faire des axios.get(url) si l'on veut car le proxy = un router qui ajoute des headers
let authHeader = ''
const opt = {
    target: 'http://localhost:5000',
    changeOrigin: true,
    onProxyReq: function (proxyReq, req, res) {
        if (req.headers && req.headers.authorization)
            authHeader = req.headers.authorization
        const dst = req.query
        if (dst && dst.hash && dst.title && dst.imdbCode && authHeader) {
            proxyReq.setHeader('Authorization', authHeader);
        }
    }
}

module.exports = function (app) {
    app.use(
        '/api',
        proxy(opt)
    );
    app.use(
        '/getSub',
        proxy(opt)
    );
};
