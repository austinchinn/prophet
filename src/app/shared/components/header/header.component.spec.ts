import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { LoginComponent } from '../login/login.component';
import { MyPicksComponent } from '../mypicks/mypicks.component';
import { LeaderboardsComponent } from './leaderboards.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let router;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ HeaderComponent, LoginComponent, MyPicksComponent, LeaderboardsComponent ],
			imports: [ HttpModule, HttpClientModule, RouterTestingModule.withRoutes([{path:'login', component: LoginComponent},{path:'mypicks', component: MyPicksComponent},{path:'leaderboards', component: LeaderboardsComponent}]), HttpClientTestingModule ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		httpMock = fixture.debugElement.injector.get(HttpTestingController);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		fixture.detectChanges();
	});

	it('should call goToPicks', () => {
		spyOn(component, 'goToPicks').and.callThrough();
		let navigateSpy = spyOn((<any>component).router, 'navigate');
		component.goToPicks();
		expect(component.goToPicks).toHaveBeenCalled();
		expect(navigateSpy).toHaveBeenCalledWith(['mypicks']);
	});

	it('should call goToLeaderboards', () => {
		spyOn(component, 'goToLeaderboards').and.callThrough();
		let navigateSpy = spyOn((<any>component).router, 'navigate');
		component.goToLeaderboards();
		expect(component.goToLeaderboards).toHaveBeenCalled();
		expect(navigateSpy).toHaveBeenCalledWith(['leaderboards']);
	});

	it('should call logout', () => {
		spyOn(component, 'logout').and.callThrough();
		let navigateSpy = spyOn((<any>component).router, 'navigate');
		component.logout();
		expect(component.logout).toHaveBeenCalled();
		expect(navigateSpy).toHaveBeenCalledWith(['login']);
	});

});
