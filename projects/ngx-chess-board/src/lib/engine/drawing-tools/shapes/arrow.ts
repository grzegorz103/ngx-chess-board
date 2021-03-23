import { DrawPoint } from '../draw-point';

export class Arrow {
    start: DrawPoint;
    end: DrawPoint;

    isEqual(arrow: Arrow) {
        return arrow && this.start.isEqual(arrow.start) && this.end.isEqual(arrow.end);
    }
}
