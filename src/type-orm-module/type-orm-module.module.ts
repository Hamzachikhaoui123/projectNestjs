import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: DataSource,
            inject: [],
            useFactory: async () => {
                try {
                    const datasource = new DataSource({
                        type: 'mysql',
                        host: 'localhost',
                        port: parseInt(process.env.PORT_BD) || 3000,
                        username: 'root',
                        password: '',
                        database: 'projectnestJs',
                        entities: [`${__dirname}/../**/**.entity{.ts,.js}`], // this will automatically load all entity file in the src folder
                        synchronize: false, // Désactivez ceci
                    });
                    await datasource.initialize();
                    console.log('Database connected successfully');
                    return datasource;
                } catch (error) {
                    console.log('Error connecting to database');
                    throw error;
                }
            }
        }

    ],
    exports:[DataSource]
})
export class TypeOrmModuleModule { }
