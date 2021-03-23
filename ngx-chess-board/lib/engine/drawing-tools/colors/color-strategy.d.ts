import { ColorProcessor } from './color-processor';
export declare class ColorStrategy {
    colorProcessor: ColorProcessor;
    constructor();
    resolve(ctrl: any, shift: any, alt: any): string;
    setColorProcessor(colorProcessor: ColorProcessor): void;
}
