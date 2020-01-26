import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
	let component: PaginationComponent;
	let fixture: ComponentFixture<PaginationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PaginationComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PaginationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('unit tests:', () => {
		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should call getMin', () => {
			spyOn(component, 'getMin').and.callThrough();
			component.perPage = 1;
			component.page = 1;
			var result = component.getMin();
			expect(component.getMin).toHaveBeenCalled();
			expect(result).toBe(1);
		});

		it('should call getMax if', () => {
			spyOn(component, 'getMax').and.callThrough();
			component.perPage = 1;
			component.page = 2;
			component.count = 1;
			var result = component.getMax();
			expect(component.getMax).toHaveBeenCalled();
			expect(result).toBe(1);
		});

		it('should call getMax else', () => {
			spyOn(component, 'getMax').and.callThrough();
			component.perPage = 1;
			component.page = 1;
			component.count = 1;
			var result = component.getMax();
			expect(component.getMax).toHaveBeenCalled();
			expect(result).toBe(1);
		});

		it('should call onPage', () => {
			spyOn(component, 'onPage').and.callThrough();
			component.onPage(1);
			expect(component.onPage).toHaveBeenCalled();
		});

		it('should call onPrev', () => {
			spyOn(component, 'onPrev').and.callThrough();
			component.onPrev();
			expect(component.onPrev).toHaveBeenCalled();
		});

		it('should call onNext', () => {
			spyOn(component, 'onNext').and.callThrough();
			component.onNext(true);
			expect(component.onNext).toHaveBeenCalled();
		});

		it('should call totalPages', () => {
			spyOn(component, 'totalPages').and.callThrough();
			component.count = 1;
			component.perPage = 1;
			var result = component.totalPages();
			expect(component.totalPages).toHaveBeenCalled();
			expect(result).toBe(1)
		});

		it('should call totalPages 0', () => {
			spyOn(component, 'totalPages').and.callThrough();
			component.count = 0;
			component.perPage = 0;
			var result = component.totalPages();
			expect(component.totalPages).toHaveBeenCalled();
			expect(result).toBe(0)
		});

		it('should call lastPage', () => {
			spyOn(component, 'lastPage').and.callThrough();
			component.count = 1;
			component.perPage = 1;
			component.page = 1;
			var result = component.lastPage();
			expect(component.lastPage).toHaveBeenCalled();
			expect(result).toBe(false)
		});

		it('should call getPages', () => {
			spyOn(component, 'getPages').and.callThrough();
			component.count = 10;
			component.perPage = 2;
			component.page = undefined;
			component.pagesToShow = undefined;
			var result = component.getPages();
			expect(component.getPages).toHaveBeenCalled();
			expect(result).toEqual([1,2,3,4,5]);
		});

		it('should call getPages if', () => {
			spyOn(component, 'getPages').and.callThrough();
			component.count = 10;
			component.perPage = 2;
			component.page = 2;
			component.pagesToShow = 2;
			var result = component.getPages();
			expect(component.getPages).toHaveBeenCalled();
			expect(result).toEqual([1,2]);
		});

	});
});
