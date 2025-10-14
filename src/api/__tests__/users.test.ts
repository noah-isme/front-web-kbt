import { resetMockData } from '../../mocks/handlers';
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  updateUser,
} from '../users';

describe('users API via MSW', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('mengambil daftar pengguna awal', async () => {
    const response = await fetchUsers();
    expect(response.data).toHaveLength(3);
    expect(response.data[0].email).toBeDefined();
  });

  it('mengambil detail pengguna berdasarkan id', async () => {
    const response = await fetchUser('user-operator');
    expect(response.data.name).toBe('Dimas Raharjo');
  });

  it('melempar error ketika pengguna tidak ditemukan', async () => {
    await expect(fetchUser('user-tidak-ada')).rejects.toMatchObject({
      code: 404,
      message: 'Pengguna tidak ditemukan',
    });
  });

  it('membuat pengguna baru', async () => {
    const payload = {
      name: 'Sinta Adelia',
      email: 'sinta@kbt.local',
      phone: '0812-3000-1004',
      role: 'viewer' as const,
      password: 'sinta123',
    };

    const response = await createUser(payload);
    expect(response.message).toContain('berhasil dibuat');
    expect(response.data).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
  });

  it('memperbarui data pengguna', async () => {
    const response = await updateUser('user-viewer', {
      name: 'Putri Lestari - Updated',
    });

    expect(response.data.id).toBe('user-viewer');
    expect(response.data.name).toBe('Putri Lestari - Updated');
    expect(response.message).toContain('berhasil diperbarui');
  });

  it('menghapus pengguna', async () => {
    const response = await deleteUser('user-operator');
    expect(response.data.id).toBe('user-operator');

    const usersAfterDelete = await fetchUsers();
    expect(usersAfterDelete.data.find((user) => user.id === 'user-operator')).toBeUndefined();
  });
});
