import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  private readonly uploadPath = join(__dirname, '..', '..', 'uploads');

  constructor() {
    this.createUploadsDirectory();
  }

  private async createUploadsDirectory() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
    name: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // const allowedMimeTypes = ['image/jpeg', 'image/png'];
    // if (!allowedMimeTypes.includes(file.mimetype)) {
    //   throw new BadRequestException('Tipo de archivo inválido');
    // }

    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${name}.${fileExtension}`;
    const destinationPath = join(this.uploadPath, destination);
    const filePath = join(destinationPath, uniqueFilename);

    try {
      await fs.mkdir(destinationPath, { recursive: true });
      await fs.writeFile(filePath, file.buffer);
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Could not save file');
    }

    const fileUrl = `/${destination}/${uniqueFilename}`;
    return fileUrl;
  }
}
