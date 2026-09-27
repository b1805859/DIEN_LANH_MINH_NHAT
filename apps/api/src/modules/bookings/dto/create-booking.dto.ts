import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CreateBookingDto {
  @IsString()
  serviceId!: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @Matches(DATE_KEY_PATTERN, { message: 'scheduledDate must use YYYY-MM-DD format.' })
  scheduledDate?: string;

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
