import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('Component:ModalComponent', () => {
	let component: ModalComponent;
	let fixture: ComponentFixture<ModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ModalComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalComponent);
		component = fixture.componentInstance;
	});

	describe('unit tests:', () => {
		it('should create the component', () => {
			expect(component).toBeTruthy();
		});

		it('should set visible to true', () => {
			spyOn(component, 'visible');
			component.show();
			expect(component.visible).toBe(true);
		});

		it('should set visibleAnimate to true', (done) => {
			spyOn(component, 'visibleAnimate');
			component.show();
			setTimeout(function(){ 
				expect(component.visibleAnimate).toBe(true);
				done();
			}, 100);
		});

		it('should set visible to false', (done) => {
			component.visible = true;
			spyOn(component, 'visible');
			component.hide();
			setTimeout(function(){ 
				expect(component.visible).toBe(false);
				done();
			}, 300);
		});

		it('should set visibleAnimate to false', () => {
			spyOn(component, 'visibleAnimate');
			component.visibleAnimate = true;
			component.hide();
			expect(component.visibleAnimate).toBe(false);     
		});
	});
});
