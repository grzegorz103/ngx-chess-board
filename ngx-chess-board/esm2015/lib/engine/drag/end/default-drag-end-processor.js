export class DefaultDragEndProcessor {
    dragEnded(event, disabling, startTrans) {
        event.source.reset();
        event.source.element.nativeElement.style.zIndex = '0';
        event.source.element.nativeElement.style.pointerEvents = 'auto';
        event.source.element.nativeElement.style.touchAction = 'auto';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1kcmFnLWVuZC1wcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvS29tcHV0ZXIvRGVza3RvcC9Ob3d5IGZvbGRlci9jaGVzcy1ib2FyZC9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjLyIsInNvdXJjZXMiOlsibGliL2VuZ2luZS9kcmFnL2VuZC9kZWZhdWx0LWRyYWctZW5kLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLE9BQU8sdUJBQXVCO0lBRWhDLFNBQVMsQ0FBQyxLQUFpQixFQUFFLFNBQWtCLEVBQUUsVUFBa0I7UUFDL0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDdEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQ2hFLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztJQUNsRSxDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZGtEcmFnRW5kLCBDZGtEcmFnU3RhcnQgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHsgRHJhZ0VuZFByb2Nlc3NvciB9IGZyb20gJy4vZHJhZy1lbmQtcHJvY2Vzc29yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RHJhZ0VuZFByb2Nlc3NvciBpbXBsZW1lbnRzIERyYWdFbmRQcm9jZXNzb3Ige1xyXG5cclxuICAgIGRyYWdFbmRlZChldmVudDogQ2RrRHJhZ0VuZCwgZGlzYWJsaW5nOiBib29sZWFuLCBzdGFydFRyYW5zOiBzdHJpbmcpIHtcclxuICAgICAgICBldmVudC5zb3VyY2UucmVzZXQoKTtcclxuICAgICAgICBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICcwJztcclxuICAgICAgICBldmVudC5zb3VyY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XHJcbiAgICAgICAgZXZlbnQuc291cmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3VjaEFjdGlvbiA9ICdhdXRvJztcclxuICAgIH1cclxuXHJcbn1cclxuIl19