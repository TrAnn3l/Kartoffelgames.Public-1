class RequestAnimationFrameMockSession {
    cancelAnimationFrame(pHandle: any) {
        globalThis.clearTimeout(pHandle);
    }
    requestAnimationFrame(pCallback: any): number {
        return <any>globalThis.setTimeout(() => {
            pCallback();
        }, 1);
    }
}

export const RequestAnimationFrameMock = new RequestAnimationFrameMockSession();

globalThis.requestAnimationFrame = RequestAnimationFrameMock.requestAnimationFrame.bind(RequestAnimationFrameMock);
globalThis.cancelAnimationFrame = RequestAnimationFrameMock.cancelAnimationFrame.bind(RequestAnimationFrameMock);