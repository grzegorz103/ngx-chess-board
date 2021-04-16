import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { DragEndProcessor } from './drag-end-processor';
export declare class AnimationDragEndProcessor implements DragEndProcessor {
    dragEnded(event: CdkDragEnd, disabling: boolean, startTrans: string): void;
}
