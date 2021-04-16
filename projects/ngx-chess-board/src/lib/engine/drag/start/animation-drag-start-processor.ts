import { CdkDragStart } from '@angular/cdk/drag-drop';
import { DragStartProcessor } from './drag-start-processor';

export class AnimationDragStartProcessor implements DragStartProcessor {

    dragStarted(event: CdkDragStart) {
        const style = event.source.getRootElement().style;
        style.zIndex = '1000';
        style.position = 'absolute';
    }

}
