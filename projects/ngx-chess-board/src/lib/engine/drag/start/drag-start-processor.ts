import { CdkDragStart } from '@angular/cdk/drag-drop';

export interface DragStartProcessor {

    dragStarted: (event: CdkDragStart) => void;

}
