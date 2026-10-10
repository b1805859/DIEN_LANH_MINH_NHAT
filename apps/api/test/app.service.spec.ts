import { AppService } from '../src/app.service';

describe('AppService', () => {
  it('returns a healthy status payload', () => {
    const service = new AppService();
    expect(service.getHealth()).toMatchObject({
      status: 'ok',
      service: 'minh-nhat-api',
    });
  });
});

