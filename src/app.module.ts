import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersModule } from './characters/characters.module';
import { Character } from './characters/characters.entity';
import { CharactersService } from './characters/characters.service';
import { CharactersController } from './characters/characters.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST_GOOGLE || process.env.DB_HOST_VERCEL,
      port: +process.env.DB_PORT_GOOGLE || +process.env.DB_PORT_VERCEL,
      username:
        process.env.DB_USERNAME_GOOGLE || process.env.DB_USERNAME_VERCEL,
      password:
        process.env.DB_PASSWORD_GOOGLE || process.env.DB_PASSWORD_VERCEL,
      database: process.env.DB_NAME_GOOGLE || process.env.DB_NAME_VERCEL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Character],
      extra: {
        ssl: true,
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Character]),
    CharactersModule,
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class AppModule {}
