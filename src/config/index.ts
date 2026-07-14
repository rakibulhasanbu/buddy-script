export const config = {
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  socketUrl: process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/api\/v1\/?$/, ""),
};
