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

window.requestAnimationFrame = globalThis.requestAnimationFrame = RequestAnimationFrameMock.requestAnimationFrame.bind(RequestAnimationFrameMock);
window.cancelAnimationFrame = globalThis.cancelAnimationFrame = RequestAnimationFrameMock.cancelAnimationFrame.bind(RequestAnimationFrameMock);