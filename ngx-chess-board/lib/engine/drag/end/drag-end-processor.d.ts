import { CdkDragEnd } from '@angular/cdk/drag-drop';
export interface DragEndProcessor {
    dragEnded: (event: CdkDragEnd) => void;
}
