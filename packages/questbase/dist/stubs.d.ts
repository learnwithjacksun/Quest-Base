export declare function createOtpApi(): {
    send(_email: string): Promise<never>;
    verify(_email: string, _code: string): Promise<never>;
};
export declare function createWaitlistApi(): {
    add(_user: Record<string, unknown>): Promise<never>;
};
export type OtpApi = ReturnType<typeof createOtpApi>;
export type WaitlistApi = ReturnType<typeof createWaitlistApi>;
//# sourceMappingURL=stubs.d.ts.map