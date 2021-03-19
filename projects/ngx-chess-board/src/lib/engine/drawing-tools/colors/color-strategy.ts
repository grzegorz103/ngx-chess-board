import { ColorProcessor } from './color-processor';
import { DefaultColorProcessor } from './default-color-processor';

export class ColorStrategy {

    colorProcessor: ColorProcessor;

    constructor() {
        this.colorProcessor = new DefaultColorProcessor();
    }

    resolve(ctrl: any, shift: any, alt: any) {
        return this.colorProcessor.resolve(ctrl, shift, alt);
    }

    setColorProcessor(colorProcessor: ColorProcessor) {
        this.colorProcessor = colorProcessor;
    }

}
