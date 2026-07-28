export class Asset {
    id?: string = ''; // Optional for new assets that haven't been saved yet
    title: string = '';
    fileKey: string = '';
    contentType: string = '';
    size: number = 0;
    description: string = '';
    tags: string = '';
    createdAt: Date = new Date();
    createdBy: string = '';
    uploadedByIp: string = '';
    uploadedByUserAgent: string = '';
    updatedAt?: Date;
    updatedBy?: string;
    isDeleted: boolean = false;
    deletedAt: Date | null = null;
    deletedBy: string | null = null;
}