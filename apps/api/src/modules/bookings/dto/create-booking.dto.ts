import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  serviceId!: string;

  @IsString()
  locationId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  @MinLength(5)
  address!: string;

  @IsString()
  @MinLength(2)
  customerName!: string;

  @IsString()
  @MinLength(8)
  customerPhone!: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

