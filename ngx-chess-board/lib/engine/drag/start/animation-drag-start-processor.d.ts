import { CdkDragStart } from '@angular/cdk/drag-drop';
import { DragStartProcessor } from './drag-start-processor';
export declare class AnimationDragStartProcessor implements DragStartProcessor {
    dragStarted(event: CdkDragStart): void;
}
