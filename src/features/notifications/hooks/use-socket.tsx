"use client";

import { ReactNode, useEffect, useRef } from "react";

import { config } from "@/config";
import { api } from "@/redux/api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { TagType } from "@/redux/types";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const token = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token || !config.socketUrl) {
      return;
    }

    socketRef.current = io(config.socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("notification:update", () => {
      dispatch(api.util.invalidateTags([TagType.Notification]));
    });

    socket.on("connect_error", () => {
      // Silent fail; polling fallback handles data fetching
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, dispatch]);

  return children;
};
