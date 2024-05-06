import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    FilesModule,],
  providers: [ConfigService],
  exports: [ConfigService]

})
export class AppModule { }







// import { Module } from '@nestjs/common';
// import { FileService } from './files/files.service';
// import { FileController } from './files/files.controller';

// @Module({
//   imports: [],
//   controllers: [FileController],
//   providers: [FileService],
// })
// export class AppModule {}
