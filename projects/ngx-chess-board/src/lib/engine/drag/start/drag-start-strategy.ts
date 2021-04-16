import { CdkDragStart } from '@angular/cdk/drag-drop';
import { AnimationDragStartProcessor } from './animation-drag-start-processor';
import { DefaultDragStartProcessor } from './default-drag-start-processor';
import { DragStartProcessor } from './drag-start-processor';

export class DragStartStrategy {

    private dragStartProcessor: DragStartProcessor;

    constructor() {
        this.dragStartProcessor = new AnimationDragStartProcessor();
    }

    public process(event: CdkDragStart): void {
        this.dragStartProcessor.dragStarted(event);
    }

    setDragStartProcessor(processor: DragStartProcessor) {
        this.dragStartProcessor = processor;
    }

}
