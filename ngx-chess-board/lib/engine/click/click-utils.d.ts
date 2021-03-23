import { Point } from '../../models/pieces/point';
import { ColorStrategy } from '../drawing-tools/colors/color-strategy';
import { DrawPoint } from '../drawing-tools/draw-point';
export declare class ClickUtils {
    static getClickPoint(event: any, top: number, height: number, left: number, width: number): Point;
    static getDrawingPoint(tileSize: number, colorStrategy: ColorStrategy, x: number, y: number, ctrl: boolean, alt: boolean, shift: boolean, xAxis: number, yAxis: number): DrawPoint;
}
