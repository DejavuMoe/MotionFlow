
export interface MotionPhotoResult {
  imageUrl: string;
  videoUrl: string;
  imageName: string;
  videoName: string;
}

/**
 * Finds the offset of the embedded video in a JPEG Motion Photo file by searching for MP4 signatures.
 * @param buffer The ArrayBuffer of the motion photo file.
 * @returns The offset of the video data, or null if not found.
 */
function findVideoOffset(buffer: ArrayBuffer): number | null {
    const bytes = new Uint8Array(buffer);
    // The MP4 video is usually appended. Search from the end of the file backwards.
    // A common signature for the start of an MP4 is the 'ftyp' atom.
    const signature = [0x66, 0x74, 0x79, 0x70]; // 'ftyp'
  
    // Start search from a reasonable position before the end.
    for (let i = bytes.length - 8; i > 0; i--) {
      let match = true;
      for (let j = 0; j < signature.length; j++) {
        if (bytes[i + j] !== signature[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        // The MP4 file atom starts with a 4-byte length, then the 4-byte type.
        // So the actual start of the video data is 4 bytes before the 'ftyp' signature.
        const videoOffset = i - 4;
        const view = new DataView(buffer, videoOffset, 4);
        const length = view.getUint32(0, false); // Read length in Big Endian
  
        // Sanity check: the atom length should be plausible
        if (length > 0 && length < buffer.byteLength) {
           return videoOffset;
        }
      }
    }
  
    return null;
}

/**
 * Processes a Google Motion Photo file (JPEG) to extract the static image and video.
 * @param file The Motion Photo .jpg file to process.
 * @returns A promise that resolves with object URLs for the image and video.
 */
export async function processMotionPhoto(file: File): Promise<MotionPhotoResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error("Could not read the file buffer.");
        }

        const videoOffset = findVideoOffset(arrayBuffer);
        
        if (videoOffset === null || videoOffset <= 0 || videoOffset >= arrayBuffer.byteLength) {
          // Fallback check for Google's specific XMP metadata, though less reliable
          const textDecoder = new TextDecoder("utf-8");
          const fileText = textDecoder.decode(arrayBuffer);
          const offsetMatch = fileText.match(/MediaDataOffset="(\d+)"/i) || fileText.match(/MicroVideoOffset="(\d+)"/i);
          let metadataOffset: number | null = offsetMatch ? parseInt(offsetMatch[1], 10) : null;
          
          if(metadataOffset && metadataOffset > 0) {
            // This offset is from the end of the file.
            metadataOffset = arrayBuffer.byteLength - metadataOffset;
          }

          if(!metadataOffset) {
             throw new Error("Not a valid Motion Photo. Could not find video data.");
          }

          const imageBlob = new Blob([arrayBuffer.slice(0, metadataOffset)], { type: "image/jpeg" });
          const videoBlob = new Blob([arrayBuffer.slice(metadataOffset)], { type: "video/mp4" });
          
          if (videoBlob.size === 0) {
            throw new Error("Extracted video data is empty.");
          }
          const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'motion-photo';
          return resolve({
            imageUrl: URL.createObjectURL(imageBlob),
            videoUrl: URL.createObjectURL(videoBlob),
            imageName: `${originalName}.jpg`,
            videoName: `${originalName}.mp4`,
          });
        }

        const imageBlob = new Blob([arrayBuffer.slice(0, videoOffset)], { type: "image/jpeg" });
        const videoContent = arrayBuffer.slice(videoOffset);
        const videoBlob = new Blob([videoContent], { type: "video/mp4" });

        if (videoBlob.size === 0) {
          throw new Error("Extracted video data is empty. The file may be corrupt or not a Motion Photo.");
        }
        
        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'motion-photo';

        resolve({
          imageUrl: URL.createObjectURL(imageBlob),
          videoUrl: URL.createObjectURL(videoBlob),
          imageName: `${originalName}.jpg`,
          videoName: `${originalName}.mp4`,
        });

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("There was an error reading the file."));
    };

    reader.readAsArrayBuffer(file);
  });
}
