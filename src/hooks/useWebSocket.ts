import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'reconnecting' | 'closed' | 'error';

interface UseWebSocketOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  heartbeatMs?: number;
}

const useWebSocket = (url: string, options?: UseWebSocketOptions) => {
  const { maxRetries = 5, baseDelayMs = 1000, heartbeatMs = 30000 } = options || {};

  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!url) {
      setStatus('closed');
      return;
    }

    setStatus(retryCountRef.current === 0 ? 'connecting' : 'reconnecting');
    const token = localStorage.getItem('access_token');
    const wsUrl = `${url}?token=${token}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus('open');
      retryCountRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Start heartbeat
      if (heartbeatMs > 0) {
        heartbeatIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send('ping'); // Send a ping message
          }
        }, heartbeatMs);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
      } catch (e) {
        console.warn('Received non-JSON WebSocket message:', event.data);
        setData(event.data); // Handle non-JSON messages as well
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      ws.close(); // Ensure connection is closed on error
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setStatus('closed');
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      if (retryCountRef.current < maxRetries) {
        const delay = Math.min(baseDelayMs * (2 ** retryCountRef.current), 30000) + Math.random() * 1000; // Max 30s delay + jitter
        retryCountRef.current += 1;
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      } else {
        console.warn('Max WebSocket reconnect retries reached.');
        setStatus('error'); // Or 'closed' depending on desired final state
      }
    };
  }, [url, maxRetries, baseDelayMs, heartbeatMs]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open. Message not sent:', message);
    }
  }, []);

  return { data, status, sendMessage };
};

export default useWebSocket;
