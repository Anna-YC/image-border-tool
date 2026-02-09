import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'frontend', 'dist');

// 读取 CSS 和 JS 文件
const cssContent = fs.readFileSync(path.join(distDir, 'assets', 'index-BjfWWbGQ.css'), 'utf-8');
const jsContent = fs.readFileSync(path.join(distDir, 'assets', 'index-Bjp9oqtz.js'), 'utf-8');

// 创建单文件 HTML
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片美化神器</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
${jsContent}
  </script>
</body>
</html>
`;

// 写入单文件
const outputFile = path.join(__dirname, 'image-border-tool-standalone.html');
fs.writeFileSync(outputFile, html, 'utf-8');

console.log('✅ 单文件版本已创建:', outputFile);
console.log('文件大小:', (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(2), 'KB');
