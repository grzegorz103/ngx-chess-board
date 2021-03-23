import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { DragEndProcessor } from './drag-end-processor';
export declare class DefaultDragEndProcessor implements DragEndProcessor {
    dragEnded(event: CdkDragEnd): void;
}
