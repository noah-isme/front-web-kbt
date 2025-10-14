import { renderHook, act, waitFor } from '@testing-library/react';

import useWebSocket from '../useWebSocket';

const WS_URL = 'ws://localhost:1234';

describe('useWebSocket', () => {
  let mockWebSocket: {
    onopen: ((this: WebSocket, ev: Event) => any) | null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
    onerror: ((this: WebSocket, ev: Event) => any) | null;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    send: jest.Mock;
    close: jest.Mock;
    readyState: number;
    url: string;
  };
  let realWebSocket: typeof WebSocket;

  beforeAll(() => {
    realWebSocket = global.WebSocket;
  });

  beforeEach(() => {
    mockWebSocket = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      send: jest.fn(),
      close: jest.fn(),
      readyState: WebSocket.CONNECTING,
      url: WS_URL,
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-access-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    global.WebSocket = jest.fn((url) => {
      mockWebSocket.url = url;
      return mockWebSocket;
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.WebSocket = realWebSocket; // Restore original WebSocket
    jest.useRealTimers(); // Ensure real timers are restored
  });

  const triggerOpen = () => {
    act(() => {
      mockWebSocket.readyState = WebSocket.OPEN;
      mockWebSocket.onopen?.(new Event('open'));
    });
  };

  const triggerClose = () => {
    act(() => {
      mockWebSocket.readyState = WebSocket.CLOSED;
      mockWebSocket.onclose?.(new CloseEvent('close'));
    });
  };

  it('should connect to WebSocket and set status to open', async () => {
    const { result } = renderHook(() => useWebSocket(WS_URL));

    expect(result.current.status).toBe('connecting');

    triggerOpen();

    await waitFor(() => expect(result.current.status).toBe('open'));
  });

  it('should receive messages from WebSocket', async () => {
    const { result } = renderHook(() => useWebSocket(WS_URL));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    const testMessage = { type: 'test', payload: 'hello' };
    act(() => {
      mockWebSocket.onmessage?.(new MessageEvent('message', { data: JSON.stringify(testMessage) }));
    });

    await waitFor(() => expect(result.current.data).toEqual(testMessage));
  });

  it('should send messages to WebSocket', async () => {
    const { result } = renderHook(() => useWebSocket(WS_URL));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    const messageToSend = { type: 'command', action: 'start' };
    act(() => {
      result.current.sendMessage(messageToSend);
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(messageToSend));
  });

  it('should attempt to reconnect with exponential backoff on close', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useWebSocket(WS_URL, { maxRetries: 3, baseDelayMs: 100 }));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();

    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // 1st retry
    act(() => { jest.advanceTimersByTime(100); });
    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // 2nd retry
    act(() => { jest.advanceTimersByTime(200); });
    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // 3rd retry
    act(() => { jest.advanceTimersByTime(400); });
    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // Max retries reached, should go to error
    act(() => { jest.advanceTimersByTime(800); });
    await waitFor(() => expect(result.current.status).toBe('error'));

    jest.useRealTimers();
  });

  it('should stop reconnecting after max retries', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useWebSocket(WS_URL, { maxRetries: 2, baseDelayMs: 50 }));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // 1st retry
    act(() => { jest.advanceTimersByTime(50); });
    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // 2nd retry
    act(() => { jest.advanceTimersByTime(100); });
    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    triggerClose();
    await waitFor(() => expect(result.current.status).toBe('reconnecting'));

    // Max retries reached
    act(() => { jest.advanceTimersByTime(200); });
    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.status).toBe('error');
    jest.useRealTimers();
  });

  it('should send heartbeat messages', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useWebSocket(WS_URL, { heartbeatMs: 1000 }));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockWebSocket.send).toHaveBeenCalledWith('ping');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockWebSocket.send).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should clean up on unmount', async () => {
    const { result, unmount } = renderHook(() => useWebSocket(WS_URL));

    triggerOpen();
    await waitFor(() => expect(result.current.status).toBe('open'));

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
