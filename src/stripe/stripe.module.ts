import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [StripeController],
  providers: [StripeService, PrismaService],
})
export class StripeModule {}
