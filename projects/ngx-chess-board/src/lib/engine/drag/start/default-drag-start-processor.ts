import { CdkDragStart } from '@angular/cdk/drag-drop';
import { DragStartProcessor } from './drag-start-processor';

export class DefaultDragStartProcessor implements DragStartProcessor {

    dragStarted(event: CdkDragStart) {
        const style = event.source.element.nativeElement.style;
        style.position = 'relative';
        style.zIndex = '1000';
        style.touchAction = 'none';
        style.pointerEvents = 'none';
    }

}
