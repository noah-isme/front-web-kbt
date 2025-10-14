jest.mock('axios', () => {
  const mockInstance = {
    defaults: { baseURL: '', headers: {} as Record<string, unknown> },
    interceptors: {
      request: {
        handlers: [] as Array<{ fulfilled?: (config: any) => any }>,
        use(fulfilled: (config: any) => any) {
          this.handlers.push({ fulfilled });
          return this.handlers.length - 1;
        },
      },
      response: {
        handlers: [] as Array<unknown>,
        use() {
          return 0;
        },
      },
    },
  };

  const create = jest.fn((config: { baseURL: string; headers: Record<string, string> }) => {
    mockInstance.defaults.baseURL = config.baseURL;
    mockInstance.defaults.headers = config.headers;
    return mockInstance;
  });

  return {
    __esModule: true,
    default: { create },
    create,
    mockInstance,
  };
});

describe('apiClient configuration', () => {
  afterEach(() => {
    window.localStorage.clear();
    jest.resetModules();
  });

  it('uses the base URL from environment variables', async () => {
    const baseUrl = 'https://example.com/api/v1';
    process.env.REACT_APP_API_BASE_URL = baseUrl;
    const module = await import('../client');
    expect(module.apiClient.defaults.baseURL).toEqual(baseUrl);
  });

  it('attaches bearer token from localStorage via request interceptor', async () => {
    process.env.REACT_APP_API_BASE_URL = 'https://example.com/api/v1';
    const module = await import('../client');
    const { apiClient } = module;

    window.localStorage.setItem('access_token', 'test-token');

    const interceptor = apiClient.interceptors.request.handlers[0];
    expect(interceptor?.fulfilled).toBeDefined();
    const config = await interceptor?.fulfilled?.({ headers: {} });

    expect(config?.headers.Authorization).toEqual('Bearer test-token');
  });
});
