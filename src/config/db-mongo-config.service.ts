import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Mongoose } from 'mongoose';

interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

@Injectable()
export class DbMongoConfigService implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        const config = this.configService.get<DatabaseConfig>('config.database');
        return {
            uri: `mongodb://${config.host}/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
            user: config.username,
            pass: config.password,
            dbName: config.database,
            autoCreate: false,
        };
    }
}