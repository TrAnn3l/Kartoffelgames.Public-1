export class EventNames {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EVENT_TARGET_PATCHED_KEY: symbol = Symbol('_Event_Target_Patched');

    public static readonly changeCriticalEvents = ['input', 'change'];
    public static readonly detailEventNames = ['toggle'];
    public static readonly documentEventNames = [
        'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
        'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
        'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
        'visibilitychange', 'resume'
    ];
    public static readonly formEventNames = ['autocomplete', 'autocompleteerror'];
    public static readonly frameEventNames = ['load'];
    public static readonly frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
    public static readonly globalEventHandlersEventNames = [
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
    public static readonly htmlElementEventNames = [
        'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
        'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
        'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
    ];
    public static readonly idbIndexEventNames = [
        'upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'
    ];
    public static readonly marqueeEventNames = ['bounce', 'finish', 'start'];
    public static readonly mediaElementEventNames = [
        'encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'
    ];
    public static readonly notificationEventNames = ['click', 'show', 'error', 'close'];
    public static readonly rtcPeerConnectionEventNames = [
        'connectionstatechange', 'datachannel', 'icecandidate', 'icecandidateerror',
        'iceconnectionstatechange', 'icegatheringstatechange', 'negotiationneeded', 'signalingstatechange', 'track'];
    public static readonly webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
    public static readonly websocketEventNames = ['close', 'error', 'open', 'message'];
    public static readonly windowEventNames = [
        'absolutedeviceorientation', 'afterinput', 'afterprint', 'appinstalled', 'beforeinstallprompt',
        'beforeprint', 'beforeunload', 'devicelight', 'devicemotion', 'deviceorientation',
        'deviceorientationabsolute', 'deviceproximity', 'hashchange', 'languagechange', 'message',
        'mozbeforepaint', 'offline', 'online', 'paint', 'pageshow', 'pagehide', 'popstate',
        'rejectionhandled', 'storage', 'unhandledrejection', 'unload', 'userproximity',
        'vrdisplyconnected', 'vrdisplaydisconnected', 'vrdisplaypresentchange'
    ];
    public static readonly workerEventNames = ['error', 'message'];
    public static readonly xmlHttpRequestEventNames = [
        'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
        'readystatechange'
    ];

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly eventNames = [
        ...EventNames.globalEventHandlersEventNames, ...EventNames.webglEventNames,
        ...EventNames.formEventNames, ...EventNames.detailEventNames, ...EventNames.documentEventNames,
        ...EventNames.windowEventNames, ...EventNames.htmlElementEventNames
    ];
}