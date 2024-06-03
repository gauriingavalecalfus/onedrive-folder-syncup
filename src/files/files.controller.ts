import { Controller, Get, Post, Delete, Param, Body, NotFoundException, BadRequestException, UploadedFile, Query, Res } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) { }

    @Get('/directory')
    async readLocalDirectory(): Promise<{ files: string[] }> {
        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');

        const directoryPath = userDirectory + '/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/1. Pre-Kickoff'; // you can change the path as per the folder from which you want to list the files
        try {
            const result = await this.fileService.readDir(directoryPath);
            console.log("Result => ", result)
            return { files: result };
        }
        catch (e) {
            console.log("Error => ", e)
            throw e;
        }
    }

    // dynamic get file list
    // dynamic download mentioning oath in the folder key

    // @Get(':filePath')
    // async readFile(@Param('filePath') filePath: string): Promise<string> {
    //     const decodedPath = decodeURIComponent(filePath);
    //     let directory = __dirname;
    //     let userDirectory = directory.split('/').slice(0, 3).join('/');
    //     console.log(userDirectory);
    //     const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/${decodedPath}`; // Update this with your actual root directory
    //     // const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/1. Pre-Kickoff/${decodedPath}`;
    //     console.log('fullpath =>', fullPath)

    //     if (!fs.existsSync(fullPath)) {
    //         throw new NotFoundException('File not found');
    //     }

    //     try {
    //         const data = await this.fileService.readFile(fullPath);
    //         return data;
    //     } catch (error) {
    //         throw new NotFoundException('Error reading file');
    //     }
    // }

    // @Post('file')
    // async createFile(@Body() body: { filePath: string; data: string }): Promise<void> {
    //     const { filePath, data } = body;
    //     return await this.fileService.createFile(filePath, data);
    // }

    @Delete(':filePath')
    async deleteFile(@Param('filePath') filePath: string): Promise<void> {
        const decodedPath = decodeURIComponent(filePath);
        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');
        const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/1. Pre-Kickoff/${decodedPath}`; // should edit the file path accordingky

        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('File not found');
        }

        try {
            return await this.fileService.deleteFile(fullPath);
        } catch (error) {
            throw new NotFoundException('Error reading file');
        }
    }

    // download file
    @Get('/download')
    async downloadFile(
        @Query('filePath') filePath: string,
        @Res() res: Response
    ): Promise<void> {
        console.log(filePath)
        if (!filePath) {
            throw new BadRequestException('FilePath not found');
        }

        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');

        // Set your root directory
        const rootDir = path.resolve(userDirectory + '/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/'); // Adjust this to your files directory
        console.log(rootDir)

        const fPath = path.resolve(rootDir, filePath);
        console.log(fPath)


        // Ensure the resolved path is within the allowed directory
        if (!fPath.startsWith(rootDir)) {
            throw new BadRequestException('Invalid file path');
        }

        if (!fs.existsSync(fPath)) {
            throw new NotFoundException('File not found');
        }

        res.download(fPath, (err) => {
            if (err) {
                throw new NotFoundException('Error downloading file');
            }
        });
    }

    // upload file
    // @Post('/upload')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: (req, file, callback) => {
    //             const directoryPath = req.body.directoryPath; // Accessing the form-data key
    //             console.log("body => ", req.body)
    //             console.log('directoryPath => ', directoryPath);
    //             if (!directoryPath) {
    //                 return callback(new BadRequestException('Directory path is required'), null);
    //             }
    //             // if (!existsSync(directoryPath)) {
    //             //     mkdirSync(directoryPath, { recursive: true });
    //             // }
    //             callback(null, directoryPath);
    //         },
    //         filename: (req, file, callback) => {
    //             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //             const ext = extname(file.originalname);
    //             const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    //             callback(null, filename);
    //         },
    //     }),
    //     fileFilter: (req, file, callback) => {
    //         // Allow all file types by not checking the MIME type here
    //         callback(null, true);
    //     }
    // }))
    // async uploadFile(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() body: { directoryPath: string }
    // ): Promise<{ message: string, file: Express.Multer.File }> {
    //     console.log("Body => ", body)
    //     if (!file) {
    //         throw new BadRequestException('File is not uploaded');
    //     }
    //     console.log('directoryPath in handler =>', body.directoryPath);
    //     return { message: 'File uploaded successfully', file };
    // }

    // @Post('directory')
    // async createDirectory(@Body() body: { directoryPath: string }): Promise<void> {
    //     const { directoryPath } = body;
    //     return await this.fileService.createDirectory(directoryPath);
    // }

    // @Delete('directory/:directoryPath')
    // async deleteDirectory(@Param('directoryPath') directoryPath: string): Promise<void> {
    //     return await this.fileService.deleteDirectory(directoryPath);
    // }
}
