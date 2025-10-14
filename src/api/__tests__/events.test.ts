import { resetMockData } from '../../mocks/handlers';
import {
  createEvent,
  deleteEvent,
  fetchEvent,
  fetchEvents,
  updateEvent,
} from '../events';

describe('events API via MSW', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('mengambil daftar event awal', async () => {
    const response = await fetchEvents();
    expect(response.data).toHaveLength(2);
    expect(response.data.map((event) => event.id)).toEqual(
      expect.arrayContaining(['event-preparasi', 'event-live-demo']),
    );
  });

  it('mengambil detail event berdasarkan id', async () => {
    const response = await fetchEvent('event-preparasi');
    expect(response.data.id).toBe('event-preparasi');
    expect(response.message).toBeUndefined();
  });

  it('melempar error 404 ketika event tidak ditemukan', async () => {
    await expect(fetchEvent('event-tidak-ada')).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it('membuat event baru', async () => {
    const payload = {
      title: 'Simulasi Kesiapan',
      description: 'Dry run sebelum hari-H.',
      startTime: '2024-12-01T01:00:00.000Z',
      endTime: '2024-12-01T04:00:00.000Z',
      locationName: 'Bandung Timur',
    };

    const response = await createEvent(payload);
    expect(response.message).toContain('berhasil dibuat');
    expect(response.data).toMatchObject({
      title: payload.title,
      description: payload.description,
      locationName: payload.locationName,
    });
    expect(response.data.id).toMatch(/^event-/);
  });

  it('memperbarui event yang sudah ada', async () => {
    const response = await updateEvent('event-preparasi', {
      title: 'KBT Road Safety 2024 - Final',
    });

    expect(response.data.id).toBe('event-preparasi');
    expect(response.data.title).toBe('KBT Road Safety 2024 - Final');
    expect(response.message).toContain('berhasil diperbarui');
  });

  it('menghapus event sesuai id', async () => {
    const response = await deleteEvent('event-live-demo');
    expect(response.data.id).toBe('event-live-demo');

    const eventsAfterDelete = await fetchEvents();
    expect(eventsAfterDelete.data.find((event) => event.id === 'event-live-demo')).toBeUndefined();
  });
});
