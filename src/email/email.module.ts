import { Module } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';
import { EmailService } from './email.service';

@Module({
  providers: [EmailAdapter, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
