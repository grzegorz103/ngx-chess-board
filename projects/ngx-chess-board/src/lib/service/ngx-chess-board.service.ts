import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NgxChessBoardService {
    private componentMethodCallSource = new Subject<any>();

    componentMethodCalled$ = this.componentMethodCallSource.asObservable();

    reset() {
        this.componentMethodCallSource.next();
    }
}
