import { CdkDragStart } from '@angular/cdk/drag-drop';
import { DragStartProcessor } from './drag-start-processor';
export declare class DragStartStrategy {
    private dragStartProcessor;
    constructor();
    process(event: CdkDragStart): void;
    setDragStartProcessor(processor: DragStartProcessor): void;
}
