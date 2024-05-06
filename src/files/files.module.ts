import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    imports: [
        HttpModule,
    ],
})
export class FilesModule { }

