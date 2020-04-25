import { Url } from 'url';

export class UserProfile {
    firstName: String;
    lastName: String;
    birthday: Date;
    email: String;
    profileImageUrl: String = null;
    profileImageFileName: String = null;
}

export class UploadFileResponse {
    fileName: String;
    fileDownloadUri: String;
    fileType: String;
    size: Number;
}