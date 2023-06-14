import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { format } from 'date-fns';
import * as sharp from 'sharp';
import * as uuid from 'uuid';

// Сжатие и ресайз изображений
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
	async transform(image: Express.Multer.File): Promise<string> {
		try {
			const filePath = `${path}/uploads/profileimages`
			const filename = format(new Date(), 'dd-MM-yy') + '_' + uuid.v4() + '.webp';
			ensureDir(filePath);
			await sharp(image.buffer)
				.resize(1000)
				.webp()
				.toFile(`${filePath}/${filename}`);
			return filename;
		} catch (e) {
			throw new HttpException('Ошибка записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}