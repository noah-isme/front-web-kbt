import { resetMockData } from '../../mocks/handlers';
import { loginRequest } from '../auth';

describe('auth API via MSW', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('mengembalikan token dan data pengguna untuk kredensial valid', async () => {
    const response = await loginRequest({
      email: 'admin@kbt.local',
      password: 'admin123',
    });

    expect(response.data.token).toBe('mock-kbt-token');
    expect(response.data.user.email).toBe('admin@kbt.local');
    expect(response.message).toContain('Login berhasil');
  });

  it('melempar error ketika kredensial tidak valid', async () => {
    await expect(
      loginRequest({
        email: 'admin@kbt.local',
        password: 'salah',
      }),
    ).rejects.toMatchObject({
      response: {
        status: 401,
      },
    });
  });
});
