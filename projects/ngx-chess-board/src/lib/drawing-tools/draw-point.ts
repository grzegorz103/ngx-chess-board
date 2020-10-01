export class DrawPoint {
    x: number;
    y: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x + 0.5;
        this.y = y + 0.5;
        this.color = color;
    }

    isEqual(that: DrawPoint) {
        return that && that.x === this.x && this.y === that.y;
    }
}
