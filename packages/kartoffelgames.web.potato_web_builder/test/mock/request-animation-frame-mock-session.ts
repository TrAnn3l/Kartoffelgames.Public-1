class RequestAnimationFrameMockSession {
    cancelAnimationFrame(pHandle: any) {
        window.clearTimeout(pHandle);
    }
    requestAnimationFrame(pCallback: any) {
        return window.setTimeout(() => {
            pCallback();
        }, 1);
    }
}

export const RequestAnimationFrameMock = new RequestAnimationFrameMockSession();

window.requestAnimationFrame = globalThis.requestAnimationFrame = RequestAnimationFrameMock.requestAnimationFrame.bind(RequestAnimationFrameMock);
window.cancelAnimationFrame = globalThis.cancelAnimationFrame = RequestAnimationFrameMock.cancelAnimationFrame.bind(RequestAnimationFrameMock);