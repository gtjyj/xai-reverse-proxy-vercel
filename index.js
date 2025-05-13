const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// 启用 CORS
app.use(cors());

// 代理所有请求到 x.ai
app.use('/', createProxyMiddleware({
  target: 'https://api.x.ai',
  changeOrigin: true,
  // 设置代理服务器响应超时时间为 5000 毫秒（5 秒）
  proxyTimeout: 1000*60*60, 
  // 设置客户端请求超时时间为 5000 毫秒（5 秒）
  proxyTimeout: 1000*60*60, 
  onProxyReq: (proxyReq, req) => {
    // 转发原始 Authorization 头
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  },
  onProxyRes: (proxyRes) => {
    // 添加CORS头
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
}));

// Vercel 需要导出 app
module.exports = app;
