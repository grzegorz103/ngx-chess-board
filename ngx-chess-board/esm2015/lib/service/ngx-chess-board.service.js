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
NgxChessBoardService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxChessBoardService_Factory() { return new NgxChessBoardService(); }, token: NgxChessBoardService, providedIn: "root" });
NgxChessBoardService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvS29tcHV0ZXIvRGVza3RvcC9Ob3d5IGZvbGRlci9jaGVzcy1ib2FyZC9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjLyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2Uvbmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUsvQixNQUFNLE9BQU8sb0JBQW9CO0lBSGpDO1FBSVksOEJBQXlCLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUV2RCwyQkFBc0IsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FLMUU7SUFIRyxLQUFLO1FBQ0QsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFDLENBQUM7Ozs7WUFWSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neENoZXNzQm9hcmRTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgY29tcG9uZW50TWV0aG9kQ2FsbFNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICBjb21wb25lbnRNZXRob2RDYWxsZWQkID0gdGhpcy5jb21wb25lbnRNZXRob2RDYWxsU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50TWV0aG9kQ2FsbFNvdXJjZS5uZXh0KCk7XHJcbiAgICB9XHJcbn1cclxuIl19