import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ConsultationsController } from './consultations.controller';

@Module({
  controllers: [BookingsController, ConsultationsController],
  providers: [BookingsService],
})
export class BookingsModule {}

