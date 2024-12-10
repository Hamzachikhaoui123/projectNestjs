import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProduitsModule } from './produits/produits.module';
import { TypeOrmModuleModule } from './type-orm-module/type-orm-module.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [ConfigModule.forRoot(), UsersModule, ProduitsModule, TypeOrmModuleModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'), // Dossier pour les photos
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
