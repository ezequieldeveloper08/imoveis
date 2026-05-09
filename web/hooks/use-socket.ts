'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/features/auth/hooks/use-auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket(namespace: string) {
  const { getUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user?.organizationId) return;

    const socketInstance = io(`${SOCKET_URL}/${namespace}`, {
      query: {
        organizationId: user.organizationId,
      },
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log(`Connected to socket namespace: ${namespace}`);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [getUser, namespace]);

  return socket;
}
