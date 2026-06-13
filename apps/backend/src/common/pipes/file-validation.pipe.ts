import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface UploadedMulterFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
}

const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  maxSizeBytes: 10 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly options: Required<FileValidationOptions>;

  constructor(options: FileValidationOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  transform(file: UploadedMulterFile | undefined): UploadedMulterFile {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Se aceptan: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.options.maxSizeBytes) {
      const maxMb = Math.round(this.options.maxSizeBytes / 1024 / 1024);

      throw new BadRequestException(
        `El archivo excede el tamaño máximo de ${maxMb} MB`,
      );
    }

    return file;
  }
}
