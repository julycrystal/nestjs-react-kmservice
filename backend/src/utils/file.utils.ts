import { join } from "path";
import { existsSync, unlinkSync } from "fs";

export const extractFileNameFromUrl = (url: string) => {
    return url.split('/')[4];
}

export const removeProfilePicture = (fileName: string) => {
    removeFile(fileName, 'profile');
}


export const removeProductPictures = (fileNames: string[]) => {
    for (const fileName of fileNames) {
        removeProductPicture(fileName);
    }
}

export const removeProductPicture = (fileName: string) => {
    removeFile(fileName, 'products');
}

const removeFile = (fileName: string, folderName: string) => {
    const filePath = join(__dirname, '..', '..', 'uploads', folderName, fileName);
    try {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
    } catch (error) {
        console.log(error)
    }
}