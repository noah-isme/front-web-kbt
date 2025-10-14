import '@testing-library/jest-dom';
import type { SetupServer } from 'msw/node';
import { TextDecoder, TextEncoder } from 'util';

const globalAny = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
  BroadcastChannel?: typeof BroadcastChannel;
};

if (!globalAny.TextEncoder) {
  globalAny.TextEncoder = TextEncoder;
}

if (!globalAny.TextDecoder) {
  globalAny.TextDecoder = TextDecoder as typeof globalAny.TextDecoder;
}

if (!globalAny.BroadcastChannel) {
  class MockBroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;
    constructor(name: string) {
      this.name = name;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postMessage(_message: unknown) {}
    close() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addEventListener(_event: string, _listener: EventListenerOrEventListenerObject) {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeEventListener(_event: string, _listener: EventListenerOrEventListenerObject) {}
  }

  globalAny.BroadcastChannel = MockBroadcastChannel as typeof globalAny.BroadcastChannel;
}

let server: SetupServer | null = null;

beforeAll(async () => {
  if (!server) {
    const module = await import('./mocks/server');
    server = module.server;
  }
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => server?.resetHandlers());
afterAll(() => server?.close());
