import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'minimal', // Set the errorFormat option
    });
  }
  async onModuleInit() {
    // Note: this is optional
    console.log('connecting to database...');
    await this.$connect();
    console.log('Connected to database!!');
  }
}
