import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [UserModule,AuthModule],
  controllers: [AppController,AuthController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
