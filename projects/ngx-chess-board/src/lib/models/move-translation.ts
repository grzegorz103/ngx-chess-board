export class MoveTranslation {
    private _xAxis: number;
    private _yAxis: number;
    private _reverted: boolean;

    constructor(xAxis: number, yAxis: number, reverted: boolean) {
        this._xAxis = xAxis;
        this._yAxis = yAxis;
        this._reverted = reverted;
    }

    get xAxis(): number {
        return this._xAxis;
    }

    set xAxis(value: number) {
        this._xAxis = value;
    }

    get yAxis(): number {
        return this._yAxis;
    }

    set yAxis(value: number) {
        this._yAxis = value;
    }

    get reverted(): boolean {
        return this._reverted;
    }

    set reverted(value: boolean) {
        this._reverted = value;
    }
}
