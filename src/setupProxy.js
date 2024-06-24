const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://take-home-assessment-423502.uc.r.appspot.com',
            changeOrigin: true,
            secure: false,
            onProxyReq: (proxyReq, req, res) => {
                console.log(`Proxying request to: ${proxyReq.url}`);
            },
            onError: (err, req, res) => {
                console.error('Proxy error:', err);
                res.status(500).json({ error: 'Proxy error', details: err.message });
            },
        })
    );
};