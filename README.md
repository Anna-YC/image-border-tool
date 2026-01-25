# 图片美化神器

一个**纯前端**的图片美化工具，为截图添加边框、阴影、圆角效果，适合微信公众号配图使用。

> ✨ **纯静态网站** - 所有处理在浏览器中完成，可直接部署到任何静态托管服务！

## 🚀 在线使用

访问：**https://anna-yc.github.io/WaytoAGI-Demo/**

## ✨ 功能特性

- 📤 **图片上传**：支持拖拽或点击上传
- 🎨 **边框效果**：自定义颜色、宽度、样式（实线/虚线/双线）
- ⭕ **圆角效果**：可调节圆角半径
- 🌑 **阴影效果**：模糊度、偏移量、颜色透明度
- 👁️ **实时预览**：所有效果即时预览
- 💾 **多格式导出**：PNG、JPG、WebP
- 🎨 **智能配色**：自动提取图片颜色建议

## 📦 本地开发

```bash
# 克隆项目
git clone https://github.com/Anna-YC/WaytoAGI-Demo.git
cd WaytoAGI-Demo

# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🔨 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建产物在 `frontend/dist` 目录，可直接部署到：
- **GitHub Pages**（本项目使用）
- Vercel
- Netlify
- Cloudflare Pages
- 任何静态文件服务器

## 🛠️ 技术栈

- **Vue 3** + Composition API
- **Vite** - 构建工具
- **TailwindCSS** - 样式框架
- **Canvas API** - 图片处理（纯前端）
- **Fabric.js** - 预览渲染

## 📁 项目结构

```
WaytoAGI-Demo/
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/   # Vue 组件
│   │   ├── composables/  # 组合式函数
│   │   └── utils/        # 工具函数
│   ├── dist/             # 构建输出（部署此目录）
│   └── ...
└── .github/workflows/    # GitHub Actions 自动部署
```

## 📄 License

MIT
