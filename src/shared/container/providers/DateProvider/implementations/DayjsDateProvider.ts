import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number {
    const expectedReturnDateFormat = this.convertToUTC(end_date);
    const dateNowFormat = this.convertToUTC(start_date);

    return dayjs(expectedReturnDateFormat).diff(dateNowFormat, 'hours');
  }

  convertToUTC(date?: Date): string {
    return dayjs(date).utc().local().format();
  }
}

export { DayjsDateProvider };
