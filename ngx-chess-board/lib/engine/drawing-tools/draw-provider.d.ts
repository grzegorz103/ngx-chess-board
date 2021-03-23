import { Arrow } from './shapes/arrow';
import { Circle } from './shapes/circle';
export declare class DrawProvider {
    private arrowsSubject$;
    private circlesSubject$;
    arrows$: import("rxjs").Observable<Arrow[]>;
    circles$: import("rxjs").Observable<Circle[]>;
    private get circles();
    private set circles(value);
    private get arrows();
    private set arrows(value);
    addCircle(circle: Circle): void;
    reomveCircle(removeCircle: Circle): void;
    addArrow(arrow: Arrow): void;
    removeArrow(removeArrow: Arrow): void;
    containsCircle(checkCircle: Circle): boolean;
    containsArrow(checkArrow: Arrow): boolean;
    clear(): void;
}
