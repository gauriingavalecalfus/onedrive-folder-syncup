import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
    async readDir(directory: string): Promise<string[]> {
        try {
            const result = await new Promise<string[]>((resolve, reject) => {
                fs.readdir(directory, (err, files) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log("Files => ", files);
                        resolve(files);
                    }
                });
            });
            console.log("Service results => ", result);
            return result;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }

    async readFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async createFile(filePath: string, data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async deleteFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async createDirectory(directoryPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.mkdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async deleteDirectory(directoryPath: string): Promise<void> {
        const result = new Promise<void>((resolve, reject) => {
            fs.rmdir(directoryPath, { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return result;
    }
}
