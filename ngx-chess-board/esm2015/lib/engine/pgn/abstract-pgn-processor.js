export class AbstractPgnProcessor {
    constructor() {
        this.pgn = '';
        this.currentIndex = 0.5;
    }
    getPGN() {
        return this.pgn;
    }
    processChecks(checkmate, check, stalemate) {
        if (checkmate) {
            this.pgn += '#';
        }
        else {
            if (check) {
                this.pgn += '+';
            }
        }
    }
    reset() {
        this.pgn = '';
        this.currentIndex = 0.5;
    }
    addPromotionChoice(promotion) {
        switch (promotion) {
            case 1:
                this.pgn += '=Q';
                break;
            case 2:
                this.pgn += '=R';
                break;
            case 3:
                this.pgn += '=B';
                break;
            case 4:
                this.pgn += '=N';
                break;
        }
    }
    removeLast() {
        if (this.currentIndex >= 0.5) {
            this.currentIndex -= 0.5;
            const regex1 = new RegExp(/\d+\./g);
            regex1.test(this.pgn);
            this.pgn = this.pgn.substring(0, regex1.lastIndex).trim();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtcGduLXByb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9Lb21wdXRlci9EZXNrdG9wL05vd3kgZm9sZGVyL2NoZXNzLWJvYXJkL3Byb2plY3RzL25neC1jaGVzcy1ib2FyZC9zcmMvIiwic291cmNlcyI6WyJsaWIvZW5naW5lL3Bnbi9hYnN0cmFjdC1wZ24tcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sT0FBZ0Isb0JBQW9CO0lBQTFDO1FBRWMsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUNULGlCQUFZLEdBQUcsR0FBRyxDQUFDO0lBc0RqQyxDQUFDO0lBN0NVLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQztJQUVELGFBQWEsQ0FBQyxTQUFrQixFQUFFLEtBQWMsRUFBRSxTQUFrQjtRQUNoRSxJQUFJLFNBQVMsRUFBRTtZQUNYLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO1NBQ25CO2FBQU07WUFDSCxJQUFJLEtBQUssRUFBRTtnQkFDUCxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQzthQUNuQjtTQUNKO0lBQ0wsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQzVCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxTQUFTO1FBQ3hCLFFBQVEsU0FBUyxFQUFFO1lBQ2YsS0FBSyxDQUFDO2dCQUNGLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNqQixNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNqQixNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNqQixNQUFNO1lBQ1YsS0FBSyxDQUFDO2dCQUNGLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNqQixNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLFlBQVksSUFBSSxHQUFHLENBQUM7WUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUUsUUFBUSxDQUFFLENBQUM7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi8uLi9tb2RlbHMvYm9hcmQnO1xyXG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMvcGllY2UnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uLy4uL21vZGVscy9waWVjZXMvcG9pbnQnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0UGduUHJvY2Vzc29yIHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcGduID0gJyc7XHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudEluZGV4ID0gMC41O1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBwcm9jZXNzKFxyXG4gICAgICAgIGJvYXJkOiBCb2FyZCxcclxuICAgICAgICBzb3VyY2VQaWVjZTogUGllY2UsXHJcbiAgICAgICAgZGVzdFBvaW50OiBQb2ludCxcclxuICAgICAgICBkZXN0UGllY2U/OiBQaWVjZVxyXG4gICAgKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0UEdOKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBnbjtcclxuICAgIH1cclxuXHJcbiAgICBwcm9jZXNzQ2hlY2tzKGNoZWNrbWF0ZTogYm9vbGVhbiwgY2hlY2s6IGJvb2xlYW4sIHN0YWxlbWF0ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChjaGVja21hdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wZ24gKz0gJyMnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChjaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wZ24gKz0gJysnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMucGduID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwLjU7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJvbW90aW9uQ2hvaWNlKHByb21vdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAocHJvbW90aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHRoaXMucGduICs9ICc9USc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wZ24gKz0gJz1SJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBnbiArPSAnPUInO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHRoaXMucGduICs9ICc9Tic7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTGFzdCgpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRJbmRleCA+PSAwLjUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggLT0gMC41O1xyXG4gICAgICAgICAgICBjb25zdCByZWdleDEgPSBuZXcgUmVnRXhwKCAvXFxkK1xcLi9nICk7XHJcbiAgICAgICAgICAgIHJlZ2V4MS50ZXN0KHRoaXMucGduKTtcclxuICAgICAgICAgICAgdGhpcy5wZ24gPSB0aGlzLnBnbi5zdWJzdHJpbmcoMCwgcmVnZXgxLmxhc3RJbmRleCkudHJpbSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIl19