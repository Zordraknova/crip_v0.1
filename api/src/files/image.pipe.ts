import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ensureDir } from 'fs-extra';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import * as sharp from 'sharp';
import * as uuid from 'uuid';
//_Загрузка_обложки статьи
@Injectable()
export class ImagePipe implements PipeTransform<Express.Multer.File, Promise<string>> {
	async transform(file: Express.Multer.File): Promise<string> {
		try {
			if (file) {
				const folder = format(new Date(), 'yyyy-MM-dd');
				const filePath = `${path}/uploads/articles/${folder}`
				const filenames = '_' + uuid.v4() + '.webp';
				const imgPath: string = (`${filePath}/${filenames}`).replace(/\\/g, '/');
				ensureDir(filePath);
				await sharp(file.buffer)
					.resize({
						fit: sharp.fit.contain,
						width: 1200
					})
					.webp({ effort: 4 })
					.toFile(`${imgPath}`);
				return imgPath
			} else {
				return null
			}
		} catch (e) {
			throw new HttpException('Ошибка записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}