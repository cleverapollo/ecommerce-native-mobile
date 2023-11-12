import { Camera, CameraPermissionState, CameraPermissionType } from "@capacitor/camera";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface LocalFile {
    name: string;
    path: string;
    data: string;
}

export const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

export const mkdir = async (dirPath: string) => {
    return Filesystem.mkdir({
        path: dirPath,
        directory: Directory.Data
    });
}

export const rmdir = async (dirPath: string) => {
    return Filesystem.rmdir({
        path: dirPath,
        directory: Directory.Data,
        recursive: true
    });
}


/**
 * Get the actual base64 data of an image base on the name of the file
 * @param dirPath Path to directory which contains the file.
 * @param fileName Name of the file to load.
 * @returns File data
 */
export const loadFileData = async (dirPath: string, fileName: string): Promise<LocalFile> => {
    const filePath = `${dirPath}/${fileName}`;
    const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data
    });
    return {
        name: fileName,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
    };
}

export const convertToArrayBuffer = async (file: LocalFile): Promise<ArrayBuffer> => {
    const response = await fetch(file.data);
    return response.arrayBuffer();
}

export const blobToFormData = (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('file', blob, fileName);
    return formData;
}

export const getFileSizeInMB = (arrayBuffer: ArrayBuffer): number => {
    return arrayBuffer.byteLength / (1024 * 1024);
}

export const checkPhotoPermissions = async (permissionType: CameraPermissionType): Promise<CameraPermissionState> => {
    const permissions = await Camera.checkPermissions();
    return permissions[permissionType];
}
