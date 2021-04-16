import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { DragEndProcessor } from './drag-end-processor';

export class AnimationDragEndProcessor implements DragEndProcessor {

    dragEnded(event: CdkDragEnd, disabling: boolean, startTrans: string) {
        if (!disabling) {
            if (startTrans) {
                event.source._dragRef.getRootElement().style.transform = startTrans;
            }
        }
    }

}
