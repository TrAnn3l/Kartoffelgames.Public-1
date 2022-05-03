export class PromiseRejectionEvent extends Event {
    readonly promise: Promise<any>;
    readonly reason: any;

    public constructor(pName: string, pInit: PromiseRejectionEventInit){
        super(pName, pInit);

        this.promise = pInit.promise;
        this.reason = pInit.reason;
    }
}

export class PreventableErrorEvent extends ErrorEvent {
    public defaultWasPrevented: boolean = false;

    public override preventDefault(): void {
        super.preventDefault();
        this.defaultWasPrevented = true;
    }
}