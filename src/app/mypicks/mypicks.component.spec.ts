import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPicksComponent } from './mypicks.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { DragulaService, DragulaModule } from 'ng2-dragula'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { LoginComponent } from '../login/login.component';
import { LeaderboardsComponent } from '../leaderboards/leaderboards.component';

describe('MypicksComponent', () => {
	let component: MyPicksComponent;
	let fixture: ComponentFixture<MyPicksComponent>;
	let router;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ MyPicksComponent, ModalComponent, PaginationComponent, LoginComponent, LeaderboardsComponent ],
			imports: [ FormsModule, HttpModule, HttpClientModule, RouterTestingModule.withRoutes([{path:'login', component: LoginComponent},{path:'leaderboards', component: LeaderboardsComponent}]), ToastrModule.forRoot(), BrowserAnimationsModule, HttpClientTestingModule ],
			providers: [ ToastrService, DragulaService ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyPicksComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		httpMock = fixture.debugElement.injector.get(HttpTestingController);
	});

	it('should create no token', () => {
		expect(component).toBeTruthy();
		let navigateSpy = spyOn((<any>component).router, 'navigate');
		localStorage.removeItem('jwtToken');
		fixture.detectChanges();
		expect(navigateSpy).toHaveBeenCalledWith(['login']);
	});

	it('should call ngOnInit error', () => {
		var temp = window.btoa('{"leaderboards":["test"],"username":"test","picks":{"naTeams":[{"name":"100 Thieves","abbr":"100"},{"name":"Cloud 9","abbr":"c9"},{"name":"Clutch Gaming","abbr":"cg"},{"name":"Counter Logic Gaming","abbr":"clg"},{"name":"Flyquest","abbr":"fly"},{"name":"Echo Fox","abbr":"fox"},{"name":"Golden Guardians","abbr":"ggs"},{"name":"Optic Gaming","abbr":"opt"},{"name":"Team Liquid","abbr":"tl"},{"name":"Team Solo Mid","abbr":"tsm"}],"euTeams":[{"name":"Fnatic","abbr":"fnc"},{"name":"Excel Esports","abbr":"xl"},{"name":"G2 Esports","abbr":"g2"},{"name":"Misfits Gaming","abbr":"msf"},{"name":"Origen","abbr":"og"},{"name":"Rogue","abbr":"rog"},{"name":"Schalke 04","abbr":"s04"},{"name":"SK Gaming","abbr":"sk"},{"name":"Splyce","abbr":"spy"},{"name":"Team Vitality","abbr":"vit"}]}}');
		localStorage.setItem('jwtToken','test.'+temp);
		fixture.detectChanges();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
	});

	it('should call ngOnInit not success', () => {
		var temp = window.btoa('{"leaderboards":["test"],"username":"test","picks":{"naTeams":[{"name":"100 Thieves","abbr":"100"},{"name":"Cloud 9","abbr":"c9"},{"name":"Clutch Gaming","abbr":"cg"},{"name":"Counter Logic Gaming","abbr":"clg"},{"name":"Flyquest","abbr":"fly"},{"name":"Echo Fox","abbr":"fox"},{"name":"Golden Guardians","abbr":"ggs"},{"name":"Optic Gaming","abbr":"opt"},{"name":"Team Liquid","abbr":"tl"},{"name":"Team Solo Mid","abbr":"tsm"}],"euTeams":[{"name":"Fnatic","abbr":"fnc"},{"name":"Excel Esports","abbr":"xl"},{"name":"G2 Esports","abbr":"g2"},{"name":"Misfits Gaming","abbr":"msf"},{"name":"Origen","abbr":"og"},{"name":"Rogue","abbr":"rog"},{"name":"Schalke 04","abbr":"s04"},{"name":"SK Gaming","abbr":"sk"},{"name":"Splyce","abbr":"spy"},{"name":"Team Vitality","abbr":"vit"}]}}');
		localStorage.setItem('jwtToken','test.'+temp);
		fixture.detectChanges();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
	});

	it('should call ngOnInit success', () => {
		var temp = window.btoa('{"leaderboards":["test"],"username":"test","picks":{"naTeams":[{"name":"100 Thieves","abbr":"100"},{"name":"Cloud 9","abbr":"c9"},{"name":"Clutch Gaming","abbr":"cg"},{"name":"Counter Logic Gaming","abbr":"clg"},{"name":"Flyquest","abbr":"fly"},{"name":"Echo Fox","abbr":"fox"},{"name":"Golden Guardians","abbr":"ggs"},{"name":"Optic Gaming","abbr":"opt"},{"name":"Team Liquid","abbr":"tl"},{"name":"Team Solo Mid","abbr":"tsm"}],"euTeams":[{"name":"Fnatic","abbr":"fnc"},{"name":"Excel Esports","abbr":"xl"},{"name":"G2 Esports","abbr":"g2"},{"name":"Misfits Gaming","abbr":"msf"},{"name":"Origen","abbr":"og"},{"name":"Rogue","abbr":"rog"},{"name":"Schalke 04","abbr":"s04"},{"name":"SK Gaming","abbr":"sk"},{"name":"Splyce","abbr":"spy"},{"name":"Team Vitality","abbr":"vit"}]}}');
		localStorage.setItem('jwtToken','test.'+temp);
		fixture.detectChanges();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, standings: {
			'naTeams':[{'teams':['tl'],'record':'4 - 0'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['opt'],'record':'0 - 4'}],
			'euTeams':[{'teams':['fnc'],'record':'4 - 0'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['sk'],'record':'0 - 4'}]
		}});
		httpMock.verify();
		expect(component.standings).toEqual({
			'naTeams':[{'teams':['tl'],'record':'4 - 0'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['opt'],'record':'0 - 4'}],
			'euTeams':[{'teams':['fnc'],'record':'4 - 0'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['sk'],'record':'0 - 4'}]
		});
		expect(component.username).toBe('test');
		expect(component.naTeams).toEqual([{name: "100 Thieves", abbr: "100", record: "2 - 2", correct: false},{name: "Cloud 9", abbr: "c9", record: "3 - 1", correct: true},{name: "Clutch Gaming", abbr: "cg", record: "2 - 2", correct: false},{name: "Counter Logic Gaming", abbr: "clg", record: "1 - 3", correct: false},{name: "Flyquest", abbr: "fly", record: "3 - 1", correct: false},{name: "Echo Fox", abbr: "fox", record: "1 - 3", correct: false}, {name: "Golden Guardians", abbr: "ggs", record: "2 - 2", correct: true},{name: "Optic Gaming", abbr: "opt", record: "0 - 4", correct: false},{name: "Team Liquid", abbr: "tl", record: "4 - 0", correct: false},{name: "Team Solo Mid", abbr: "tsm", record: "2 - 2", correct: false}]);
		expect(component.euTeams).toEqual([{name: "Fnatic", abbr: "fnc", record: "4 - 0", correct: true},{name: "Excel Esports", abbr: "xl", record: "2 - 2", correct: false},{name: "G2 Esports", abbr: "g2", record: "3 - 1", correct: true},{name: "Misfits Gaming", abbr: "msf", record: "2 - 2", correct: true},{name: "Origen", abbr: "og", record: "2 - 2", correct: true},{name: "Rogue", abbr: "rog", record: "1 - 3", correct: false},{name: "Schalke 04", abbr: "s04", record: "1 - 3", correct: false},{name: "SK Gaming", abbr: "sk", record: "0 - 4", correct: false},{name: "Splyce", abbr: "spy", record: "2 - 2", correct: false},{name: "Team Vitality", abbr: "vit", record: "3 - 1", correct: false}]);
		expect(component.points).toBe(12);
	});

	it('should call saveOrder error', () => {
		spyOn(component, 'saveOrder').and.callThrough();
		component.saveOrder();
		const req = httpMock.expectOne(`/api/savepicks`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.saveOrder).toHaveBeenCalled();
	});

	it('should call saveOrder not success', () => {
		spyOn(component, 'saveOrder').and.callThrough();
		component.saveOrder();
		const req = httpMock.expectOne(`/api/savepicks`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.saveOrder).toHaveBeenCalled();
	});

	it('should call saveOrder success', () => {
		spyOn(component, 'saveOrder').and.callThrough();
		component.saveOrder();
		const req = httpMock.expectOne(`/api/savepicks`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, token: 'bearer token'});
		httpMock.verify();
		expect(component.saveOrder).toHaveBeenCalled();
	});
});
