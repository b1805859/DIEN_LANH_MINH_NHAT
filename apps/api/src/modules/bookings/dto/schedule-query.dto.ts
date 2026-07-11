import { Matches } from 'class-validator';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class ScheduleQueryDto {
  @Matches(DATE_KEY_PATTERN, { message: 'from must use YYYY-MM-DD format.' })
  from!: string;

  @Matches(DATE_KEY_PATTERN, { message: 'to must use YYYY-MM-DD format.' })
  to!: string;
}
