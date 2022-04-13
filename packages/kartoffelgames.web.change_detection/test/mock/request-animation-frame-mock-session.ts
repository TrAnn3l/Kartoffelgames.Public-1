class RequestAnimationFrameMockSession {
    cancelAnimationFrame(pHandle: any) {
        globalThis.clearTimeout(pHandle);
    }
    requestAnimationFrame(pCallback: any) {
        return globalThis.setTimeout(() => {
            pCallback();
        }, 1);
    }
}

export const RequestAnimationFrameMock = new RequestAnimationFrameMockSession();

globalThis.requestAnimationFrame = globalThis.requestAnimationFrame = RequestAnimationFrameMock.requestAnimationFrame.bind(RequestAnimationFrameMock);
globalThis.cancelAnimationFrame = globalThis.cancelAnimationFrame = RequestAnimationFrameMock.cancelAnimationFrame.bind(RequestAnimationFrameMock);