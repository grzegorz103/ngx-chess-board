import { ColorProcessor } from './color-processor';

export class DefaultColorProcessor implements ColorProcessor{

    resolve(ctrl: any, shift: any, alt: any): string{
        let color = 'green';

        if (ctrl || shift) {
            color = 'red';
        }
        if (alt) {
            color = 'blue';
        }
        if ((shift || ctrl) && alt) {
            color = 'orange';
        }

        return color;
    }

}
