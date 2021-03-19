import { Point } from '../../models/pieces/point';
import { ColorStrategy } from '../drawing-tools/colors/color-strategy';
import { DrawPoint } from '../drawing-tools/draw-point';

export class ClickUtils {

    static getClickPoint(
        event: any,
        top: number,
        height: number,
        left: number,
        width: number
    ) {
        return new Point(
            Math.floor((event.y - top) / (height / 8)),
            Math.floor((event.x - left) / (width / 8)
            )
        );
    }

    static getDrawingPoint(
        tileSize: number,
        colorStrategy: ColorStrategy,
        x: number,
        y: number,
        ctrl: boolean,
        alt: boolean,
        shift: boolean,
        xAxis: number,
        yAxis: number
    ) {
        const squareSize = tileSize / 8;
        const xx = Math.floor(
            (x - xAxis) /
            squareSize
        );
        const yy = Math.floor(
            (y - yAxis) /
            squareSize
        );

        let color = colorStrategy.resolve(ctrl, shift, alt);

        return new DrawPoint(
            Math.floor(xx * squareSize + squareSize / 2),
            Math.floor(yy * squareSize + squareSize / 2),
            color
        );
    }

}
