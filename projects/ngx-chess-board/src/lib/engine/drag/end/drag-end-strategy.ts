import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AnimationDragEndProcessor } from './animation-drag-end-processor';
import { DefaultDragEndProcessor } from './default-drag-end-processor';
import { DragEndProcessor } from './drag-end-processor';

export class DragEndStrategy {

    private dragEndProcessor: DragEndProcessor;

    constructor() {
        this.dragEndProcessor = new AnimationDragEndProcessor();
    }

    public process(event: CdkDragEnd, disabling: boolean, startTrans: string): void {
        this.dragEndProcessor.dragEnded(event, disabling, startTrans);
    }

    setDragEndProcessor(processor: DragEndProcessor) {
        this.dragEndProcessor = processor;
    }

}
