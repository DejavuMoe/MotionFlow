# MotionFlow

This is a Next.js application built in Firebase Studio that allows users to extract still images and video clips from Android Motion Photos. All processing is done client-side for privacy.

## Features

- **Client-Side Processing**: All file processing happens directly in the browser. No files are uploaded to any server, ensuring user privacy.
- **Drag & Drop and File Selection**: Users can either drag and drop Motion Photo files or select them from their local file system.
- **Batch Processing**: Process multiple Motion Photo files at once.
- **Extract Image & Video**: For each valid Motion Photo, it extracts a high-quality JPEG image and an MP4 video clip.
- **Download All**: Provides an option to download all extracted files as a single ZIP archive.

## Browser Requirements

For the best experience, please use a modern web browser.
- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Apple Safari (latest version)

## How to Use

1.  **Upload Files**: Drag and drop one or more `.jpg` Motion Photo files onto the upload area, or click the area to open a file selector.
2.  **Process**: Click the "Process Files" button to start the extraction. The process runs entirely in your browser.
3.  **Download**: Once processing is complete, you can download the extracted `.jpg` images and `.mp4` videos individually.
4.  **Download All**: Use the "Download All (.zip)" button to save all extracted files in a single zip archive.
5.  **Start Over**: Click "Process More Files" to clear the results and start again.

## FAQ

**Q: Why can't my photos from a VIVO or iQOO phone be processed?**
A: Currently, Motion Photos from VIVO and iQOO devices are not supported because they do not follow Google's official Motion Photo format specifications. This may be addressed in a future update.

**Q: Which phone brands have been tested?**
A: The application has been successfully tested with Motion Photos from the following brands:
- Google Pixel
- Samsung
- OPPO
- OnePlus
- Realme
- Xiaomi / Redmi

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **ZIP Archiving**: [JSZip](https://stuk.github.io/jszip/)

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── globals.css         # Global styles and Tailwind CSS configuration.
│   │   ├── layout.tsx          # Root layout of the application.
│   │   └── page.tsx            # The main page component for the application.
│   │
│   ├── components
│   │   ├── ui/                 # UI components from ShadCN.
│   │   ├── logo.tsx            # The application logo component.
│   │   └── motion-flow-processor.tsx # The core component handling file uploads, processing, and display of results.
│   │
│   ├── hooks
│   │   └── use-toast.ts        # Custom hook for displaying toast notifications.
│   │
│   └── lib
│       └── motion-photo.ts     # Core logic for parsing JPEG Motion Photos to extract image and video data.
│
├── public/                     # Static assets.
├── package.json                # Project dependencies and scripts.
└── tailwind.config.ts          # Tailwind CSS configuration file.
```

### Key Dependencies in `package.json`

- `"next"`: The core framework for the application, handling routing, rendering, and more.
- `"react"`, `"react-dom"`: The library for building the user interface.
- `"tailwindcss"`: A utility-first CSS framework for styling.
- `"lucide-react"`: A library for icons used throughout the application.
- `"class-variance-authority"`, `"clsx"`, `"tailwind-merge"`: Utilities for managing and merging Tailwind CSS classes.
- `"@radix-ui/react-slot"`, `"@radix-ui/react-toast"`: Low-level UI primitives that power some of the ShadCN components.
- `"jszip"`: A library for creating, reading, and editing `.zip` files, used for the "Download All" feature.
- `"typescript"`: Provides static typing for the project, improving code quality and maintainability.
