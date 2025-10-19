
"use client";

import { useState, useRef, useEffect, type DragEvent } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Loader2,
  FileImage,
  FileVideo,
  Download,
  Wand2,
  XCircle,
  Trash2,
  Package,
} from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { processMotionPhoto, type MotionPhotoResult } from '@/lib/motion-photo';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type ProcessedResult = MotionPhotoResult & {
  id: string;
  originalFileName: string;
};

type ProcessResultUnion = (MotionPhotoResult & { id: string; originalFileName: string; error?: never; }) | {
  id: string;
  originalFileName: string;
  error: string;
  imageUrl?: never;
  videoUrl?: never;
  imageName?: never;
  videoName?: never;
};

export function MotionFlowProcessor() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      results.forEach(result => {
        URL.revokeObjectURL(result.imageUrl);
        URL.revokeObjectURL(result.videoUrl);
      });
    };
  }, [results]);

  const resetState = () => {
    setFiles([]);
    setResults([]);
    setError(null);
    setIsProcessing(false);
    setIsZipping(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setError(null);
      setResults([]);
      
      const newFiles = Array.from(selectedFiles);
      const validFiles = newFiles.filter(
        file => file.type === 'image/jpeg'
      );

      if (validFiles.length < newFiles.length) {
        const invalidCount = newFiles.length - validFiles.length;
        const message = `${invalidCount} file(s) were invalid. Please upload only JPG files.`;
        setError(message);
        toast({
          variant: 'destructive',
          title: 'Invalid Files Detected',
          description: `Skipped ${invalidCount} unsupported file(s).`,
        });
      }

      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setResults([]);

    const promises = files.map(file => {
      return processMotionPhoto(file)
        .then(result => ({
          ...result,
          id: `${file.name}-${file.lastModified}`,
          originalFileName: file.name,
        }))
        .catch(err => {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
          console.error(`Failed to process ${file.name}:`, errorMessage);
          return {
            id: `${file.name}-${file.lastModified}`,
            originalFileName: file.name,
            error: errorMessage,
          };
        });
    });

    const processedResults: ProcessResultUnion[] = await Promise.all(promises);
    
    const successfulResults = processedResults.filter((r): r is ProcessedResult => !r.error);
    const failedResults = processedResults.filter(r => !!r.error);

    setResults(successfulResults);

    if (failedResults.length > 0) {
      const failedFiles = failedResults.map(f => f.originalFileName).join(', ');
      const errorMessage = `Failed to process ${failedResults.length} file(s): ${failedFiles}. They may not be valid Motion Photos.`;
       setError(errorMessage);
       toast({
         variant: 'destructive',
         title: 'Some Files Failed',
         description: `Could not process ${failedResults.length} file(s).`,
       });
    }

    setFiles([]);
    setIsProcessing(false);
  };
  
  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      
      for (const result of results) {
        const imageResponse = await fetch(result.imageUrl);
        const imageBlob = await imageResponse.blob();
        zip.file(result.imageName, imageBlob);

        const videoResponse = await fetch(result.videoUrl);
        const videoBlob = await videoResponse.blob();
        zip.file(result.videoName, videoBlob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'MotionFlow_Export.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: 'Download Started',
        description: 'Your files are being downloaded as a zip archive.',
      });

    } catch(err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to create zip file: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Zip Creation Failed',
        description: 'Could not create the zip file.',
      });
    } finally {
      setIsZipping(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const hasPendingFiles = files.length > 0;
  const hasResults = results.length > 0;
  const isWorking = isProcessing || isZipping;

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Motion Photos Processor</CardTitle>
        <CardDescription>
          Built for privacy. All processing is done in your browser. Upload Android Motion Photos, extract static images (.jpg) and video clips (.mp4).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasResults && !hasPendingFiles && !isProcessing && (
          <div
            className={cn(
              'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors',
              isDragging ? 'border-primary bg-accent' : 'border-border hover:border-primary/50',
            )}
            onDrop={handleDrop}
            onDragEnter={handleDragEvents}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragEvents}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-semibold">
              {isDragging ? 'Drop them like they\'re hot!' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground">supported formats: .jpg or .MP.jpg</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,.jpg,.MP.jpg"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        )}

        {hasPendingFiles && !isProcessing && (
          <div className="space-y-4">
             <div className="flex items-center justify-between rounded-md border bg-muted/50 p-4">
              <div>
                <p className="font-medium">{files.length} file(s) selected.</p>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  {files.map(f => f.name).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setFiles([])} disabled={isWorking}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <span className="sr-only">Clear selection</span>
                </Button>
                <Button onClick={handleProcessFiles} size="sm" disabled={isWorking}>
                  {isProcessing ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                  Process Files
                </Button>
              </div>
            </div>
          </div>
        )}

        {(isProcessing || isZipping) && (
          <div className="flex flex-col items-center justify-center space-y-2 text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {isProcessing ? `Processing ${files.length} file(s)... this happens in your browser.` : 'Zipping files for download...'}
            </p>
          </div>
        )}

        {error && !isWorking && (
           <Alert variant="destructive">
             <XCircle className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}

        {hasResults && !isWorking &&(
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-center">
              Extraction Complete! ({results.length} file(s) processed)
            </h3>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto p-2">
              {results.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg">
                  <p className="text-sm font-medium truncate mb-4">{result.originalFileName}</p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-md font-medium"><FileImage className="text-primary"/> Extracted Image</h4>
                      <div className="overflow-hidden rounded-lg border">
                        <Image
                          src={result.imageUrl}
                          alt="Extracted static image"
                          width={400}
                          height={300}
                          className="aspect-video w-full object-contain bg-muted"
                        />
                      </div>
                      <Button asChild className="w-full bg-primary/90 hover:bg-primary">
                        <a href={result.imageUrl} download={result.imageName}>
                          <Download className="mr-2" /> Download Image (.jpg)
                        </a>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-md font-medium"><FileVideo className="text-primary"/> Extracted Video</h4>
                      <div className="overflow-hidden rounded-lg border">
                        <video
                          src={result.videoUrl}
                          controls
                          className="aspect-video w-full bg-black"
                        />
                      </div>
                      <Button asChild className="w-full bg-primary/90 hover:bg-primary">
                        <a href={result.videoUrl} download={result.videoName}>
                          <Download className="mr-2" /> Download Video (.mp4)
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      {(hasResults || hasPendingFiles) && !isWorking && (
        <CardFooter className="flex-col gap-4">
          {hasResults && (
             <Button onClick={handleDownloadAll} className="w-full" disabled={isZipping}>
                {isZipping ? <Loader2 className="mr-2 animate-spin" /> : <Package className="mr-2" />}
                Download All (.zip)
             </Button>
          )}
          <Button variant="outline" className="w-full" onClick={resetState}>
            Process More Files
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
