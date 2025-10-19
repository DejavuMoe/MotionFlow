# MotionFlow

这是一个在 Firebase Studio 中构建的 Next.js 应用程序，允许用户从 Android 动态照片中提取静态图像和视频剪辑。为了保护隐私，所有处理都在客户端完成。

## 功能

- **客户端处理**: 所有文件处理直接在浏览器中进行。任何文件都不会上传到服务器，确保用户隐私。
- **拖放与文件选择**: 用户可以拖放动态照片文件，也可以从本地文件系统中选择它们。
- **批量处理**: 一次性处理多个动态照片文件。
- **提取图像和视频**: 为每个有效的动态照片提取高质量的 JPEG 图像和 MP4 视频剪辑。
- **全部下载**: 提供将所有提取的文件打包为单个 ZIP 压缩包下载的选项。

## 浏览器要求

为了获得最佳体验，请使用现代的网页浏览器。
- Google Chrome (最新版本)
- Mozilla Firefox (最新版本)
- Microsoft Edge (最新版本)
- Apple Safari (最新版本)

## 如何使用

1.  **上传文件**: 将一个或多个 `.jpg` 格式的动态照片文件拖放到上传区域，或单击该区域打开文件选择器。
2.  **处理**: 点击“处理文件”按钮开始提取。该过程完全在您的浏览器中运行。
3.  **下载**: 处理完成后，您可以单独下载提取的 `.jpg` 图像和 `.mp4` 视频。
4.  **全部下载**: 使用“全部下载 (.zip)”按钮将所有提取的文件保存为单个 zip 压缩包。
5.  **重新开始**: 点击“处理更多文件”以清除结果并重新开始。

## 常见问题

**问：为什么我的 VIVO 或 iQOO 手机拍摄的照片无法处理？**
答：目前，不支持来自 VIVO 和 iQOO 设备的动态照片，因为它们不符合谷歌官方的动态照片格式规范。这个问题可能会在未来的更新中解决。

**问：哪些手机品牌已经过测试？**
答：该应用程序已成功测试了以下品牌的动态照片：
- 谷歌 Pixel
- 三星
- OPPO
- OnePlus
- Realme
- 小米 / 红米

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [ShadCN/UI](https://ui.shadcn.com/)
- **ZIP 归档**: [JSZip](https://stuk.github.io/jszip/)

## 项目结构

```
.
├── src
│   ├── app
│   │   ├── globals.css         # 全局样式和 Tailwind CSS 配置
│   │   ├── layout.tsx          # 应用程序的根布局
│   │   └── page.tsx            # 应用程序的主页面组件
│   │
│   ├── components
│   │   ├── ui/                 # 来自 ShadCN 的 UI 组件
│   │   ├── logo.tsx            # 应用程序徽标组件
│   │   └── motion-flow-processor.tsx # 处理文件上传、处理和结果显示的核心组件
│   │
│   ├── hooks
│   │   └── use-toast.ts        # 用于显示吐司通知的自定义钩子
│   │
│   └── lib
│       └── motion-photo.ts     # 用于解析 JPEG 动态照片以提取图像和视频数据的核心逻辑
│
├── public/                     # 静态资源
├── package.json                # 项目依赖和脚本
└── tailwind.config.ts          # Tailwind CSS 配置文件
```

### `package.json` 中的关键依赖

- `"next"`: 应用程序的核心框架，处理路由、渲染等。
- `"react"`, `"react-dom"`: 用于构建用户界面的库。
- `"tailwindcss"`: 一个用于样式设计的工具优先的 CSS 框架。
- `"lucide-react"`: 在整个应用程序中使用的图标库。
- `"class-variance-authority"`, `"clsx"`, `"tailwind-merge"`: 用于管理和合并 Tailwind CSS 类的实用程序。
- `"@radix-ui/react-slot"`, `"@radix-ui/react-toast"`: 一系列低级 UI 基元，为部分 ShadCN 组件提供支持。
- `"jszip"`: 一个用于创建、读取和编辑 `.zip` 文件的库，用于“全部下载”功能。
- `"typescript"`: 为项目提供静态类型，提高代码质量和可维护性。
