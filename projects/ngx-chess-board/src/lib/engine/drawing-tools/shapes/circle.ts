import { DrawPoint } from '../draw-point';

export class Circle {
    drawPoint: DrawPoint;

    isEqual(circle: Circle) {
        return circle && this.drawPoint.isEqual(circle.drawPoint);
    }
}
