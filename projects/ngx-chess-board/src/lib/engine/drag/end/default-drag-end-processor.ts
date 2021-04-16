import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { DragEndProcessor } from './drag-end-processor';

export class DefaultDragEndProcessor implements DragEndProcessor {

    dragEnded(event: CdkDragEnd, disabling: boolean, startTrans: string) {
        event.source.reset();
        event.source.element.nativeElement.style.zIndex = '0';
        event.source.element.nativeElement.style.pointerEvents = 'auto';
        event.source.element.nativeElement.style.touchAction = 'auto';
    }

}
