import { CdkDragEnd } from '@angular/cdk/drag-drop';

export interface ColorProcessor {

    resolve: (ctrl: any, shift: any, alt: any) => string;

}
