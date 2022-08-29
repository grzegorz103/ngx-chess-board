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
NgxChessBoardService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgxChessBoardService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0", ngImport: i0, type: NgxChessBoardService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoZXNzLWJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjL2xpYi9zZXJ2aWNlL25neC1jaGVzcy1ib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLL0IsTUFBTSxPQUFPLG9CQUFvQjtJQUhqQztRQUlZLDhCQUF5QixHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFFdkQsMkJBQXNCLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFlBQVksRUFBRSxDQUFDO0tBSzFFO0lBSEcsS0FBSztRQUNELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQyxDQUFDOztpSEFQUSxvQkFBb0I7cUhBQXBCLG9CQUFvQixjQUZqQixNQUFNOzJGQUVULG9CQUFvQjtrQkFIaEMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neENoZXNzQm9hcmRTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgY29tcG9uZW50TWV0aG9kQ2FsbFNvdXJjZSA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICBjb21wb25lbnRNZXRob2RDYWxsZWQkID0gdGhpcy5jb21wb25lbnRNZXRob2RDYWxsU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50TWV0aG9kQ2FsbFNvdXJjZS5uZXh0KCk7XHJcbiAgICB9XHJcbn1cclxuIl19