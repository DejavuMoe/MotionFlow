# MotionFlow

> [!IMPORTANT]
> MotionFlow has been discontinued and is no longer maintained. Its Motion Photo functionality has been merged into [PicForge](https://github.com/DejavuMoe/PicForge). Please use PicForge for current development, bug fixes, and future updates. This repository is retained for historical reference.

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
A: Motion Photos from VIVO and iQOO devices are not supported in this archived codebase because they do not follow Google's official Motion Photo format specifications. For current support and updates, please see [PicForge](https://github.com/DejavuMoe/PicForge).

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
│   ├── components
│   ├── hooks
│   └── lib
```

### Key Dependencies in `package.json`

- `next`
- `react`
- `react-dom`
- `tailwindcss`
- `jszip`
- `typescript`
