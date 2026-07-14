import { User } from "@/features/auth/types";
import { api } from "@/redux/api";
import { METHOD } from "@/redux/types";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    verifySignupOTP: builder.mutation<{ user: User; accessToken: string }, { token: number }>({
      query: (payload) => ({
        url: `/auth/verify-signup-token`,
        method: METHOD.POST,
        body: payload,
      }),
    }),
    reSendVerificationSignupOTP: builder.mutation<void, { email: string }>({
      query: (payload) => ({
        url: `/auth/resend-signup-email/${payload.email}`,
        method: METHOD.POST,
        body: payload,
      }),
    }),
  }),
});

export const { useVerifySignupOTPMutation, useReSendVerificationSignupOTPMutation } = authApi;
