import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class NgxChessBoardService {
    constructor() {
        this.componentMethodCallSource = new Subject();
        this.componentMethodCalled$ = this.componentMethodCallSource.asObservable();
    }
    reset() {
        this.componentMethodCallSource.next();
    }
}
NgxChessBoardService.ɵfac = function NgxChessBoardService_Factory(t) { return new (t || NgxChessBoardService)(); };
NgxChessBoardService.ɵprov = i0.ɵɵdefineInjectable({ token: NgxChessBoardService, factory: NgxChessBoardService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxChessBoardService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvS29tcHV0ZXIvRGVza3RvcC9Ob3d5IGZvbGRlci9jaGVzcy1ib2FyZC9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUsvQixNQUFNLE9BQU8sb0JBQW9CO0lBSGpDO1FBSVksOEJBQXlCLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUV2RCwyQkFBc0IsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FLMUU7SUFIRyxLQUFLO1FBQ0QsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFDLENBQUM7O3dGQVBRLG9CQUFvQjs0REFBcEIsb0JBQW9CLFdBQXBCLG9CQUFvQixtQkFGakIsTUFBTTtrREFFVCxvQkFBb0I7Y0FIaEMsVUFBVTtlQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hDaGVzc0JvYXJkU2VydmljZSB7XHJcbiAgICBwcml2YXRlIGNvbXBvbmVudE1ldGhvZENhbGxTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgY29tcG9uZW50TWV0aG9kQ2FsbGVkJCA9IHRoaXMuY29tcG9uZW50TWV0aG9kQ2FsbFNvdXJjZS5hc09ic2VydmFibGUoKTtcclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudE1ldGhvZENhbGxTb3VyY2UubmV4dCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==