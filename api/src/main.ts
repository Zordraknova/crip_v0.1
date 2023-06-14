import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { createLogger } from 'config/logger';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from 'path';
import helmet from 'helmet';
import setDefaultUser from './users/set-default-user';
import { ConfigService } from '@nestjs/config';
// import * as csurf from 'csurf'

async function bootstrap() {
    const PORT = process.env.PORT || 7000;  // порт $истемной переменой или  7000.
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: createLogger() || ['error', 'warn', 'debug']
    });

    //_______ПРОВЕРКИ 
    app.useGlobalPipes(                     // ________________ERROR_AlERT
        new ValidationPipe({
            transform: true,
        }),
    );
    //___________Swagger_________________________
    if (process.env.PORT == '7000') {
        const config = new DocumentBuilder()
            .setTitle('Ukonnect')
            .setDescription('The API documention')
            .setVersion('1.3.1')
            .addTag(' /for develop only/ ')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('/api-docs', app, document);
    }
    //_______________________________________________
    // app.use(csurf());
    app.useStaticAssets(join(__dirname, 'public'));
    app.setBaseViewsDir(join(__dirname, 'upload'));
    const config = app.get(ConfigService);
    setDefaultUser(config);
    app.setViewEngine('html');
    app.enableCors();
    app.use(helmet());
    await app.listen(PORT, () => console.log(`🛑[WEB_SERVER_RUN_👌] on port = http://localhost:${PORT}/`));
}
bootstrap();
