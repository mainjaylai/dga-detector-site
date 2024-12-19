# DGA 域名检测工具

这是一个基于深度学习的 DGA (Domain Generation Algorithm) 域名检测工具，可以帮助识别潜在的恶意域名。

## 功能特点

- 实时域名检测
- 基于 TensorFlow.js 的深度学习模型
- 用户友好的界面
- 详细的检测结果展示

## 在线演示

访问 [https://mainjay.github.io/dga-detector/](https://mainjay.github.io/dga-detector/) 体验在线演示。

## 本地开发

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/mainjay/dga-detector.git
cd dga-detector
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

## 技术栈

- React
- TypeScript
- TensorFlow.js
- Vite

## 项目结构

```
dga-detector/
├── src/
│   ├── components/     # 组件目录
│   │   ├── Loading.tsx
│   │   └── Loading.css
│   ├── App.tsx        # 主应用组件
│   ├── App.css        # 主样式文件
│   └── main.tsx       # 入口文件
├── public/
│   └── model/         # 模型文件目录
│       ├── model.json
│       └── *.bin
├── index.html         # HTML 模板
├── vite.config.ts     # Vite 配置
└── package.json       # 项目配置
```

## 使用说明

1. 在输入框中输入要检测的域名
2. 点击"开始检测"按钮
3. 等待检测结果
4. 查看域名是否为恶意域名及其置信度

## 许可证

MIT License

## 作者

MainJay

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基本的域名检测功能
- 添加用户友好的界面
