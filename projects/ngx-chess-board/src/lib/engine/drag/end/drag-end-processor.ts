import { CdkDragEnd } from '@angular/cdk/drag-drop';

export interface DragEndProcessor {

    dragEnded: (event: CdkDragEnd, disabling: boolean, startTrans: string) => void;

}
