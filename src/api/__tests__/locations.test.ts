import { resetMockData } from '../../mocks/handlers';
import { fetchLiveLocations } from '../locations';

describe('locations API via MSW', () => {
  beforeEach(() => {
    resetMockData();
  });

  it('mengambil lokasi live untuk event tertentu', async () => {
    const response = await fetchLiveLocations('event-preparasi');
    expect(response.data).toHaveLength(3);
    expect(response.data[0]).toHaveProperty('lat');
  });

  it('mengembalikan array kosong ketika event tidak memiliki lokasi', async () => {
    const response = await fetchLiveLocations('event-tidak-ada');
    expect(response.data).toHaveLength(0);
  });
});
