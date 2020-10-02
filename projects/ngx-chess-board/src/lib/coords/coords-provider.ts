export class CoordsProvider {
    private defaultXCoords: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    private reversedXCoords: string[] = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

    private defaultYCoords: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
    private reversedYCoords: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

    private currentXCoords: string[] = this.defaultXCoords;
    private currentYCoords: number[] = this.defaultYCoords;

    get xCoords(): string[] {
        return this.currentXCoords;
    }

    get yCoords(): number[] {
        return this.currentYCoords;
    }

    reverse() {
        this.currentXCoords = this.reversedXCoords;
        this.currentYCoords = this.reversedYCoords;
    }

    reset() {
        this.init();
    }

    private init() {
        this.currentXCoords = this.defaultXCoords;
        this.currentYCoords = this.defaultYCoords;
    }
}
