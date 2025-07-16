import { useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:13000';

export function useSocket(): Socket {
    const socket = useMemo(() => io(SOCKET_URL), []);
    return socket;
}
