"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config = require("config");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const serverConfig = config.get("server");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useStaticAssets(path_1.join(__dirname, "..", "uploads/images"));
    await app.listen(process.env.PORT || serverConfig.port);
}
bootstrap();
//# sourceMappingURL=main.js.map