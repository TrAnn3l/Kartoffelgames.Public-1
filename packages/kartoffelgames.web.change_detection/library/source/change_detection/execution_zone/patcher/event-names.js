"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNames = void 0;
class EventNames {
}
exports.EventNames = EventNames;
// eslint-disable-next-line @typescript-eslint/naming-convention
EventNames.EVENT_TARGET_PATCHED_KEY = Symbol('_Event_Target_Patched');
EventNames.changeCriticalEvents = ['input', 'change'];
EventNames.detailEventNames = ['toggle'];
EventNames.documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
EventNames.formEventNames = ['autocomplete', 'autocompleteerror'];
EventNames.frameEventNames = ['load'];
EventNames.frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
EventNames.globalEventHandlersEventNames = [
    'abort', 'animationcancel', 'animationend', 'animationiteration', 'auxclick', 'beforeinput', 'blur',
    'cancel', 'canplay', 'canplaythrough', 'change', 'compositionstart', 'compositionupdate',
    'compositionend', 'cuechange', 'click', 'close', 'contextmenu', 'curechange', 'dblclick', 'drag',
    'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'drop', 'durationchange', 'emptied',
    'ended', 'error', 'focus', 'focusin', 'focusout', 'gotpointercapture', 'input', 'invalid', 'keydown',
    'keypress', 'keyup', 'load', 'loadstart', 'loadeddata', 'loadedmetadata', 'lostpointercapture',
    'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
    'orientationchange', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter',
    'pointerleave', 'pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockerchange',
    'pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror', 'pointermove', 'pointout',
    'pointerover', 'pointerup', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'seeked', 'seeking',
    'select', 'selectionchange', 'selectstart', 'show', 'sort', 'stalled', 'submit', 'suspend', 'timeupdate',
    'volumechange', 'touchcancel', 'touchmove', 'touchstart', 'touchend', 'transitioncancel',
    'transitionend', 'waiting', 'wheel'
];
EventNames.htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
EventNames.idbIndexEventNames = [
    'upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'
];
EventNames.marqueeEventNames = ['bounce', 'finish', 'start'];
EventNames.mediaElementEventNames = [
    'encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'
];
EventNames.notificationEventNames = ['click', 'show', 'error', 'close'];
EventNames.rtcPeerConnectionEventNames = [
    'connectionstatechange', 'datachannel', 'icecandidate', 'icecandidateerror',
    'iceconnectionstatechange', 'icegatheringstatechange', 'negotiationneeded', 'signalingstatechange', 'track'
];
EventNames.webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
EventNames.websocketEventNames = ['close', 'error', 'open', 'message'];
EventNames.windowEventNames = [
    'absolutedeviceorientation', 'afterinput', 'afterprint', 'appinstalled', 'beforeinstallprompt',
    'beforeprint', 'beforeunload', 'devicelight', 'devicemotion', 'deviceorientation',
    'deviceorientationabsolute', 'deviceproximity', 'hashchange', 'languagechange', 'message',
    'mozbeforepaint', 'offline', 'online', 'paint', 'pageshow', 'pagehide', 'popstate',
    'rejectionhandled', 'storage', 'unhandledrejection', 'unload', 'userproximity',
    'vrdisplyconnected', 'vrdisplaydisconnected', 'vrdisplaypresentchange'
];
EventNames.workerEventNames = ['error', 'message'];
EventNames.xmlHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
// eslint-disable-next-line @typescript-eslint/member-ordering
EventNames.eventNames = [
    ...EventNames.globalEventHandlersEventNames, ...EventNames.webglEventNames,
    ...EventNames.formEventNames, ...EventNames.detailEventNames, ...EventNames.documentEventNames,
    ...EventNames.windowEventNames, ...EventNames.htmlElementEventNames
];
//# sourceMappingURL=event-names.js.map