import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { DefaultDragEndProcessor } from './default-drag-end-processor';
import { DragEndProcessor } from './drag-end-processor';

export class DragEndStrategy {

    private dragEndProcessor: DragEndProcessor;

    constructor() {
        this.dragEndProcessor = new DefaultDragEndProcessor();
    }

    public process(event: CdkDragEnd): void {
        this.dragEndProcessor.dragEnded(event);
    }

    setDragEndProcessor(processor: DragEndProcessor) {
        this.dragEndProcessor = processor;
    }

}
