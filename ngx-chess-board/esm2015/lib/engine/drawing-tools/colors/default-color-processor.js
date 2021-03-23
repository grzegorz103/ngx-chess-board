export class DefaultColorProcessor {
    resolve(ctrl, shift, alt) {
        let color = 'green';
        if (ctrl || shift) {
            color = 'red';
        }
        if (alt) {
            color = 'blue';
        }
        if ((shift || ctrl) && alt) {
            color = 'orange';
        }
        return color;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1jb2xvci1wcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvS29tcHV0ZXIvRGVza3RvcC9Ob3d5IGZvbGRlci9jaGVzcy1ib2FyZC9wcm9qZWN0cy9uZ3gtY2hlc3MtYm9hcmQvc3JjLyIsInNvdXJjZXMiOlsibGliL2VuZ2luZS9kcmF3aW5nLXRvb2xzL2NvbG9ycy9kZWZhdWx0LWNvbG9yLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8scUJBQXFCO0lBRTlCLE9BQU8sQ0FBQyxJQUFTLEVBQUUsS0FBVSxFQUFFLEdBQVE7UUFDbkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBRXBCLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUNmLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDakI7UUFDRCxJQUFJLEdBQUcsRUFBRTtZQUNMLEtBQUssR0FBRyxNQUFNLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUN4QixLQUFLLEdBQUcsUUFBUSxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29sb3JQcm9jZXNzb3IgfSBmcm9tICcuL2NvbG9yLXByb2Nlc3Nvcic7XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0Q29sb3JQcm9jZXNzb3IgaW1wbGVtZW50cyBDb2xvclByb2Nlc3NvcntcblxuICAgIHJlc29sdmUoY3RybDogYW55LCBzaGlmdDogYW55LCBhbHQ6IGFueSk6IHN0cmluZ3tcbiAgICAgICAgbGV0IGNvbG9yID0gJ2dyZWVuJztcblxuICAgICAgICBpZiAoY3RybCB8fCBzaGlmdCkge1xuICAgICAgICAgICAgY29sb3IgPSAncmVkJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWx0KSB7XG4gICAgICAgICAgICBjb2xvciA9ICdibHVlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHNoaWZ0IHx8IGN0cmwpICYmIGFsdCkge1xuICAgICAgICAgICAgY29sb3IgPSAnb3JhbmdlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbn1cbiJdfQ==