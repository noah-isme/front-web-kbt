import { TextDecoder, TextEncoder } from 'util';

const globalAny = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
};

if (!globalAny.TextEncoder) {
  globalAny.TextEncoder = TextEncoder;
}

if (!globalAny.TextDecoder) {
  globalAny.TextDecoder = TextDecoder;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setupServer } = require('msw/node') as typeof import('msw/node');

import { handlers } from './handlers';

export const server = setupServer(...handlers);
