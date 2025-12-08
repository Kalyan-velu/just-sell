import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import configuration, { ConfigType } from '../config/configuration';
import { Addresses } from '../models/address.model';
import { Users } from '../models/user.model';
import { Sellers } from '../models/vendor.model';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { JwtStrategy } from '../modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pg = config.get<ConfigType['pg']>('pg');
        console.log('PG:', pg);
        return {
          dialect: 'postgres',
          host: pg?.host,
          port: pg?.port,
          username: pg?.username,
          password: pg?.password,
          database: pg?.database,
          models: [Users, Sellers, Addresses],
          autoLoadModels: true,
        };
      },
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    SequelizeModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
