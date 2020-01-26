import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyPicksComponent } from '../mypicks/mypicks.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
	  declarations: [ LoginComponent, ModalComponent, MyPicksComponent ],
	  imports: [ FormsModule, HttpModule, HttpClientModule, RouterTestingModule.withRoutes([{path:'mypicks', component: MyPicksComponent}]), ToastrModule.forRoot(), BrowserAnimationsModule, HttpClientTestingModule ],
	  providers: [ ToastrService ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(LoginComponent);
	component = fixture.componentInstance;
	router = fixture.debugElement.injector.get(Router);
	httpMock = fixture.debugElement.injector.get(HttpTestingController);
  });

  it('should create', () => {
	expect(component).toBeTruthy();
	fixture.detectChanges();
  });

  it('should call login error', () => {
	spyOn(component, 'login').and.callThrough();
	component.loginData = {username:'test',password:'test'};
	component.login();

	const req = httpMock.expectOne(`/api/signin`);
	expect(req.request.method).toBe('POST');
	req.error(new ErrorEvent('error'));
	httpMock.verify();
	expect(component.login).toHaveBeenCalled();
  });

  it('should call login not success', () => {
	spyOn(component, 'login').and.callThrough();
	component.loginData = {username:'test',password:'test'};
	component.login();

	const req = httpMock.expectOne(`/api/signin`);
	expect(req.request.method).toBe('POST');
	req.flush({success: false, msg: 'Incorrect password'});
	httpMock.verify();
	expect(component.login).toHaveBeenCalled();
  });

  it('should call login success', () => {
	let navigateSpy = spyOn((<any>component).router, 'navigate');
	spyOn(component, 'login').and.callThrough();
	component.loginData = {username:'test',password:'test'};
	component.login();

	const req = httpMock.expectOne(`/api/signin`);
	expect(req.request.method).toBe('POST');
	req.flush({success: true, token: 'bearer token'});
	httpMock.verify();
	expect(component.login).toHaveBeenCalled();
	expect(navigateSpy).toHaveBeenCalledWith(['mypicks']);
  });

  it('should call openModal', () => {
	spyOn(component, 'openModal').and.callThrough();
	component.openModal();
	expect(component.openModal).toHaveBeenCalled();
  });

  it('should call register error', () => {
	spyOn(component, 'register').and.callThrough();
	component.registerData = {username:'test',password:'test'};
	component.register();

	const req = httpMock.expectOne(`/api/register`);
	expect(req.request.method).toBe('POST');
	req.error(new ErrorEvent('error'));
	httpMock.verify();
	expect(component.register).toHaveBeenCalled();
  });

  it('should call register not success', () => {
	spyOn(component, 'register').and.callThrough();
	component.registerData = {username:'test',password:'test'};
	component.register();

	const req = httpMock.expectOne(`/api/register`);
	expect(req.request.method).toBe('POST');
	req.flush({success: false, msg: 'Username already exists'});
	httpMock.verify();
	expect(component.register).toHaveBeenCalled();
  });

  it('should call register success', () => {
	spyOn(component, 'register').and.callThrough();
	component.registerData = {username:'test',password:'test'};
	component.register();

	const req = httpMock.expectOne(`/api/register`);
	expect(req.request.method).toBe('POST');
	req.flush({success: true, msg: 'Successfully registered!'});
	httpMock.verify();
	expect(component.register).toHaveBeenCalled();
	expect(component.registerData).toEqual({username:'', password: ''});
  });

  it('should call closeRegister', () => {
	spyOn(component, 'closeRegister').and.callThrough();
	component.closeRegister();
	expect(component.closeRegister).toHaveBeenCalled();
	expect(component.registerData).toEqual({username:'', password: ''});
  });
});
