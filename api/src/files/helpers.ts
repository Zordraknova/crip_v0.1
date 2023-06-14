const fs = require('fs');
export const removeFile = (fullFilePath: string): void => {
	try {
		fs.unlinkSync(fullFilePath);
	} catch (err) {
		console.error(err);
	}
};