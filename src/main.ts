
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from 'helmet';




async function start() {
    const PORT = process.env.PORT || 7000;  // порт $истемной переменой или  5000.
    const app = await NestFactory.create(AppModule);

    //___________Swagger_________________________
    if (process.env.PORT == '7000') {

        const config = new DocumentBuilder()
            .setTitle('ANiTo')
            .setDescription('The ANiTo API documention')
            .setVersion('1.1')
            .addTag('for develop only')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('/api', app, document);
    }
    //_______________________________________________
    app.use(helmet())
    await app.listen(PORT, () => console.log(`[WEB]🛑 💃Server start on port = http://localhost:${PORT}/`));

}

start();
