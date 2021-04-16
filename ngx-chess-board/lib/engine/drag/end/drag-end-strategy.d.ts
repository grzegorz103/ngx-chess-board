import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { DragEndProcessor } from './drag-end-processor';
export declare class DragEndStrategy {
    private dragEndProcessor;
    constructor();
    process(event: CdkDragEnd, disabling: boolean, startTrans: string): void;
    setDragEndProcessor(processor: DragEndProcessor): void;
}
