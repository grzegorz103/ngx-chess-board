import { AnimationDragEndProcessor } from './animation-drag-end-processor';
export class DragEndStrategy {
    constructor() {
        this.dragEndProcessor = new AnimationDragEndProcessor();
    }
    process(event, disabling, startTrans) {
        this.dragEndProcessor.dragEnded(event, disabling, startTrans);
    }
    setDragEndProcessor(processor) {
        this.dragEndProcessor = processor;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1lbmQtc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvS29tcHV0ZXIvRGVza3RvcC9Ob3d5IGZvbGRlci9jaGVzcy1ib2FyZC9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjLyIsInNvdXJjZXMiOlsibGliL2VuZ2luZS9kcmFnL2VuZC9kcmFnLWVuZC1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUkzRSxNQUFNLE9BQU8sZUFBZTtJQUl4QjtRQUNJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUM7SUFDNUQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxLQUFpQixFQUFFLFNBQWtCLEVBQUUsVUFBa0I7UUFDcEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxTQUEyQjtRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO0lBQ3RDLENBQUM7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0RyYWdFbmQgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IEFuaW1hdGlvbkRyYWdFbmRQcm9jZXNzb3IgfSBmcm9tICcuL2FuaW1hdGlvbi1kcmFnLWVuZC1wcm9jZXNzb3InO1xuaW1wb3J0IHsgRGVmYXVsdERyYWdFbmRQcm9jZXNzb3IgfSBmcm9tICcuL2RlZmF1bHQtZHJhZy1lbmQtcHJvY2Vzc29yJztcbmltcG9ydCB7IERyYWdFbmRQcm9jZXNzb3IgfSBmcm9tICcuL2RyYWctZW5kLXByb2Nlc3Nvcic7XG5cbmV4cG9ydCBjbGFzcyBEcmFnRW5kU3RyYXRlZ3kge1xuXG4gICAgcHJpdmF0ZSBkcmFnRW5kUHJvY2Vzc29yOiBEcmFnRW5kUHJvY2Vzc29yO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZHJhZ0VuZFByb2Nlc3NvciA9IG5ldyBBbmltYXRpb25EcmFnRW5kUHJvY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHByb2Nlc3MoZXZlbnQ6IENka0RyYWdFbmQsIGRpc2FibGluZzogYm9vbGVhbiwgc3RhcnRUcmFuczogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhZ0VuZFByb2Nlc3Nvci5kcmFnRW5kZWQoZXZlbnQsIGRpc2FibGluZywgc3RhcnRUcmFucyk7XG4gICAgfVxuXG4gICAgc2V0RHJhZ0VuZFByb2Nlc3Nvcihwcm9jZXNzb3I6IERyYWdFbmRQcm9jZXNzb3IpIHtcbiAgICAgICAgdGhpcy5kcmFnRW5kUHJvY2Vzc29yID0gcHJvY2Vzc29yO1xuICAgIH1cblxufVxuIl19