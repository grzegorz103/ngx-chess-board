import { CdkDragStart } from '@angular/cdk/drag-drop';
import { DragStartProcessor } from './drag-start-processor';
export declare class DefaultDragStartProcessor implements DragStartProcessor {
    dragStarted(event: CdkDragStart): void;
}
