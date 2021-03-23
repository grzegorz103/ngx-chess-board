import { BehaviorSubject } from 'rxjs';
import { Arrow } from './shapes/arrow';
import { Circle } from './shapes/circle';

export class DrawProvider {
    private arrowsSubject$ = new BehaviorSubject<Arrow[]>([]);
    private circlesSubject$ = new BehaviorSubject<Circle[]>([]);

    public arrows$ = this.arrowsSubject$.asObservable();
    public circles$ = this.circlesSubject$.asObservable();

    private get circles(): Circle[] {
        return this.circlesSubject$.value;
    }

    private set circles(circles: Circle[]) {
        this.circlesSubject$.next(circles);
    }

    private get arrows(): Arrow[] {
        return this.arrowsSubject$.value;
    }

    private set arrows(arrows: Arrow[]) {
        this.arrowsSubject$.next(arrows);
    }

    addCircle(circle: Circle) {
        this.circles = [...this.circles, circle];
    }

    reomveCircle(removeCircle: Circle) {
        this.circles = this.circles.filter((circle) => !circle.isEqual(removeCircle));
    }

    addArrow(arrow: Arrow) {
        this.arrows = [...this.arrows, arrow];
    }

    removeArrow(removeArrow: Arrow) {
        this.arrows = this.arrows.filter((arrow) => !arrow.isEqual(removeArrow));
    }

    containsCircle(checkCircle: Circle) {
        return this.circles.some((circle) => circle.isEqual(checkCircle));
    }

    containsArrow(checkArrow: Arrow) {
        return this.arrows.some((arrow: Arrow) => arrow.isEqual(checkArrow));
    }

    clear() {
        this.arrows = [];
        this.circles = [];
    }
}
