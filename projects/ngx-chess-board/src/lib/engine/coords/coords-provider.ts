export class CoordsProvider {
    private readonly defaultXCoords: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    private readonly defaultYCoords: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

    private currentXCoords: string[] = [...this.defaultXCoords];
    private currentYCoords: number[] = [...this.defaultYCoords];

    get xCoords(): string[] {
        return this.currentXCoords;
    }

    get yCoords(): number[] {
        return this.currentYCoords;
    }

    reverse() {
        this.currentXCoords = this.currentXCoords.reverse();
        this.currentYCoords = this.currentYCoords.reverse();
    }

    reset() {
        this.init();
    }

    private init() {
        this.currentXCoords = [...this.defaultXCoords];
        this.currentYCoords = [...this.defaultYCoords];
    }
}
