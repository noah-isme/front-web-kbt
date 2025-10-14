import { rest } from 'msw';

import {
  ApiResponse,
  AuthResponse,
  CreateEventInput,
  CreateUserInput,
  Event,
  LiveLocation,
  LoginPayload,
  UpdateEventInput,
  UpdateUserInput,
  User,
} from '../types';

const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Utama',
    email: 'admin@kbt.local',
    phone: '0812-3000-1001',
    role: 'admin',
    createdAt: '2024-09-12T08:15:00.000Z',
    updatedAt: '2024-11-08T10:20:00.000Z',
  },
  {
    id: 'user-operator',
    name: 'Dimas Raharjo',
    email: 'dimas@kbt.local',
    phone: '0812-3000-1002',
    role: 'operator',
    createdAt: '2024-10-01T04:05:00.000Z',
    updatedAt: '2024-11-10T06:30:00.000Z',
  },
  {
    id: 'user-viewer',
    name: 'Putri Lestari',
    email: 'putri@kbt.local',
    phone: '0812-3000-1003',
    role: 'viewer',
    createdAt: '2024-10-18T02:30:00.000Z',
    updatedAt: '2024-11-05T08:45:00.000Z',
  },
];

const initialEvents: Event[] = [
  {
    id: 'event-preparasi',
    title: 'KBT Road Safety 2024',
    description: 'Monitoring route kesiapan sebelum tur utama dimulai.',
    startTime: '2024-11-24T01:00:00.000Z',
    endTime: '2024-11-24T06:00:00.000Z',
    locationName: 'Kota Bandung',
    createdAt: '2024-11-10T07:15:00.000Z',
    updatedAt: '2024-11-12T09:20:00.000Z',
  },
  {
    id: 'event-live-demo',
    title: 'Operasi KBT Live Demo',
    description: 'Simulasi koordinasi logistik dan pemantauan real-time.',
    startTime: '2024-11-28T02:30:00.000Z',
    endTime: '2024-11-28T08:00:00.000Z',
    locationName: 'Jakarta Convention Center',
    createdAt: '2024-11-15T03:10:00.000Z',
    updatedAt: '2024-11-16T04:45:00.000Z',
  },
];

const initialLocations: LiveLocation[] = [
  {
    id: 'loc-1',
    eventId: 'event-preparasi',
    label: 'Unit 1 - Barat',
    lat: -6.917664,
    lng: 107.619125,
    updatedAt: '2024-11-24T02:15:00.000Z',
  },
  {
    id: 'loc-2',
    eventId: 'event-preparasi',
    label: 'Unit 2 - Timur',
    lat: -6.905977,
    lng: 107.613144,
    updatedAt: '2024-11-24T02:18:00.000Z',
  },
  {
    id: 'loc-3',
    eventId: 'event-preparasi',
    label: 'Unit 3 - Selatan',
    lat: -6.930355,
    lng: 107.610381,
    updatedAt: '2024-11-24T02:22:00.000Z',
  },
  {
    id: 'loc-4',
    eventId: 'event-live-demo',
    label: 'Tim Koordinasi',
    lat: -6.21462,
    lng: 106.84513,
    updatedAt: '2024-11-28T04:10:00.000Z',
  },
  {
    id: 'loc-5',
    eventId: 'event-live-demo',
    label: 'Pos 1',
    lat: -6.218922,
    lng: 106.84823,
    updatedAt: '2024-11-28T04:15:00.000Z',
  },
];

const usersDb: User[] = [];
const eventsDb: Event[] = [];
const liveLocationsDb: LiveLocation[] = [];

export const resetMockData = () => {
  usersDb.splice(
    0,
    usersDb.length,
    ...initialUsers.map((user) => ({
      ...user,
    })),
  );
  eventsDb.splice(
    0,
    eventsDb.length,
    ...initialEvents.map((event) => ({
      ...event,
    })),
  );
  liveLocationsDb.splice(
    0,
    liveLocationsDb.length,
    ...initialLocations.map((location) => ({
      ...location,
    })),
  );
};

resetMockData();

const validLogin: LoginPayload = {
  email: 'admin@kbt.local',
  password: 'admin123',
};

const nowIso = () => new Date().toISOString();

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 11)}`;

const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
});

const errorResponse = <T>(message: string): ApiResponse<T> =>
  ({
    data: null as unknown as T,
    message,
    error: message,
  }) as ApiResponse<T>;

const withDelay = (ms: number) => (ms > 0 ? ms : undefined);

export const handlers = [
  rest.post(/\/auth\/login$/, async (req, res, ctx) => {
    const payload = (await req.json()) as LoginPayload;

    if (payload.email !== validLogin.email || payload.password !== validLogin.password) {
      return res(
        ctx.delay(withDelay(150)),
        ctx.status(401),
        ctx.json<ApiResponse<AuthResponse>>(errorResponse<AuthResponse>('Email atau password tidak valid')),
      );
    }

    const user = usersDb.find((candidate) => candidate.email === payload.email) ?? initialUsers[0];

    return res(
      ctx.delay(withDelay(150)),
      ctx.status(200),
      ctx.json<ApiResponse<AuthResponse>>(
        successResponse(
          {
            access: 'mock-access-token',
            refresh: 'mock-refresh-token',
            user,
          },
          'Login berhasil (MSW)',
        ),
      ),
    );
  }),

  rest.get(/\/events$/, async (_req, res, ctx) =>
    res(
      ctx.delay(withDelay(120)),
      ctx.status(200),
      ctx.json<ApiResponse<Event[]>>(successResponse([...eventsDb])),
    ),
  ),

  rest.get(/\/events\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const event = eventsDb.find((candidate) => candidate.id === id);
    if (!event) {
      return res(
        ctx.delay(withDelay(120)),
        ctx.status(404),
        ctx.json<ApiResponse<Event>>(errorResponse<Event>('Event tidak ditemukan')),
      );
    }
    return res(
      ctx.delay(withDelay(120)),
      ctx.status(200),
      ctx.json<ApiResponse<Event>>(successResponse({ ...event })),
    );
  }),

  rest.post(/\/events$/, async (req, res, ctx) => {
    const payload = (await req.json()) as CreateEventInput;
    const timestamp = nowIso();
    const newEvent: Event = {
      id: generateId('event'),
      title: payload.title,
      description: payload.description,
      startTime: payload.startTime,
      endTime: payload.endTime,
      locationName: payload.locationName,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    eventsDb.unshift(newEvent);
    return res(
      ctx.delay(withDelay(150)),
      ctx.status(201),
      ctx.json<ApiResponse<Event>>(successResponse(newEvent, 'Event berhasil dibuat (MSW)')),
    );
  }),

  rest.put(/\/events\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const payload = (await req.json()) as UpdateEventInput;
    const index = eventsDb.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      return res(
        ctx.delay(withDelay(150)),
        ctx.status(404),
        ctx.json<ApiResponse<Event>>(errorResponse<Event>('Event tidak ditemukan')),
      );
    }
    const updated: Event = {
      ...eventsDb[index],
      ...payload,
      updatedAt: nowIso(),
    };
    eventsDb[index] = updated;
    return res(
      ctx.delay(withDelay(150)),
      ctx.status(200),
      ctx.json<ApiResponse<Event>>(successResponse(updated, 'Event berhasil diperbarui (MSW)')),
    );
  }),

  rest.delete(/\/events\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const index = eventsDb.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      return res(
        ctx.delay(withDelay(150)),
        ctx.status(404),
        ctx.json<ApiResponse<{ id: string }>>(errorResponse<{ id: string }>('Event tidak ditemukan')),
      );
    }
    eventsDb.splice(index, 1);
    for (let i = liveLocationsDb.length - 1; i >= 0; i -= 1) {
      if (liveLocationsDb[i]?.eventId === id) {
        liveLocationsDb.splice(i, 1);
      }
    }
    return res(
      ctx.delay(withDelay(150)),
      ctx.status(200),
      ctx.json<ApiResponse<{ id: string }>>(successResponse({ id }, 'Event berhasil dihapus (MSW)')),
    );
  }),

  rest.get(/\/users$/, async (_req, res, ctx) =>
    res(
      ctx.delay(withDelay(100)),
      ctx.status(200),
      ctx.json<ApiResponse<User[]>>(successResponse([...usersDb])),
    ),
  ),

  rest.get(/\/users\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const user = usersDb.find((candidate) => candidate.id === id);
    if (!user) {
      return res(
        ctx.delay(withDelay(100)),
        ctx.status(404),
        ctx.json<ApiResponse<User>>(errorResponse<User>('Pengguna tidak ditemukan')),
      );
    }
    return res(
      ctx.delay(withDelay(100)),
      ctx.status(200),
      ctx.json<ApiResponse<User>>(successResponse({ ...user })),
    );
  }),

  rest.post(/\/users$/, async (req, res, ctx) => {
    const payload = (await req.json()) as CreateUserInput;
    const timestamp = nowIso();
    const { password: _password, ...restPayload } = payload;
    void _password;
    const newUser: User = {
      id: generateId('user'),
      ...restPayload,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    usersDb.unshift(newUser);
    return res(
      ctx.delay(withDelay(150)),
      ctx.status(201),
      ctx.json<ApiResponse<User>>(successResponse(newUser, 'Pengguna berhasil dibuat (MSW)')),
    );
  }),

  rest.put(/\/users\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const payload = (await req.json()) as UpdateUserInput;
    const index = usersDb.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      return res(
        ctx.delay(withDelay(150)),
        ctx.status(404),
        ctx.json<ApiResponse<User>>(errorResponse<User>('Pengguna tidak ditemukan')),
      );
    }
    const { password: _password, ...restPayload } = payload;
    void _password;
    const updated: User = {
      ...usersDb[index],
      ...restPayload,
      updatedAt: nowIso(),
    };
    usersDb[index] = updated;
    return res(
      ctx.delay(withDelay(150)),
      ctx.status(200),
      ctx.json<ApiResponse<User>>(successResponse(updated, 'Pengguna berhasil diperbarui (MSW)')),
    );
  }),

  rest.delete(/\/users\/(?<id>[^/]+)$/, async (req, res, ctx) => {
    const { id } = req.params as { id: string };
    const index = usersDb.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      return res(
        ctx.delay(withDelay(120)),
        ctx.status(404),
        ctx.json<ApiResponse<{ id: string }>>(errorResponse<{ id: string }>('Pengguna tidak ditemukan')),
      );
    }
    usersDb.splice(index, 1);
    return res(
      ctx.delay(withDelay(120)),
      ctx.status(200),
      ctx.json<ApiResponse<{ id: string }>>(successResponse({ id }, 'Pengguna berhasil dihapus (MSW)')),
    );
  }),

  rest.get(/\/locations$/, async (req, res, ctx) => {
    const eventId = req.url.searchParams.get('eventId');
    if (!eventId) {
      return res(
        ctx.delay(withDelay(180)),
        ctx.status(400),
        ctx.json<ApiResponse<LiveLocation[]>>(errorResponse<LiveLocation[]>('Parameter eventId wajib diisi')),
      );
    }
    const locations = liveLocationsDb.filter((location) => location.eventId === eventId);
    return res(
      ctx.delay(withDelay(180)),
      ctx.status(200),
      ctx.json<ApiResponse<LiveLocation[]>>(successResponse([...locations])),
    );
  }),
];
