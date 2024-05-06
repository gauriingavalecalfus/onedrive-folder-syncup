import { Controller, Get, Post, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { FilesService } from './files.service';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) { }

    @Get('/directory')
    async readLocalDirectory(): Promise<string[]> {
        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');
        console.log(userDirectory);

        const directoryPath = userDirectory + '/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench';
        try {
            const result = await this.fileService.readDir(directoryPath);
            console.log("Result => ", result)
            return result;
        }
        catch (e) {
            console.log("Error => ", e)
            throw e;
        }
    }

    @Get(':filePath')
    async readFile(@Param('filePath') filePath: string): Promise<string> {
        const decodedPath = decodeURIComponent(filePath);
        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');
        console.log(userDirectory);
        // const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/${decodedPath}`; // Update this with your actual root directory
        const fullPath = userDirectory +  `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/1. Pre-Kickoff/${decodedPath}`;
        console.log('fullpath =>',fullPath)

        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('File not found');
        }

        try {
            const data = await this.fileService.readFile(fullPath);
            return data;
        } catch (error) {
            throw new NotFoundException('Error reading file');
        }
    }

    @Post('file')
    async createFile(@Body() body: { filePath: string; data: string }): Promise<void> {
        const { filePath, data } = body;
        return await this.fileService.createFile(filePath, data);
    }

    @Delete(':filePath')
    async deleteFile(@Param('filePath') filePath: string): Promise<void> {
        const decodedPath = decodeURIComponent(filePath);
        let directory = __dirname;
        let userDirectory = directory.split('/').slice(0, 3).join('/');
        console.log(userDirectory);
        // const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/${decodedPath}`; // Update this with your actual root directory
        const fullPath = userDirectory + `/Library/CloudStorage/OneDrive-CalfusTechnologiesIndiaPrivateLimited/Calfus cloud Implementation workbench/1. Pre-Kickoff/${decodedPath}`;
        console.log('fullpath =>', fullPath)

        if (!fs.existsSync(fullPath)) {
            throw new NotFoundException('File not found');
        }

        try {
            return await this.fileService.deleteFile(fullPath);
        } catch (error) {
            throw new NotFoundException('Error reading file');
        }
    }
    
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
