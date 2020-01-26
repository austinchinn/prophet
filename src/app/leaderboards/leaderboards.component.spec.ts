import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardsComponent } from './leaderboards.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { LoginComponent } from '../login/login.component';
import { MyPicksComponent } from '../mypicks/mypicks.component';

describe('LeaderboardsComponent', () => {
	let component: LeaderboardsComponent;
	let fixture: ComponentFixture<LeaderboardsComponent>;
	let router;
	let httpMock: HttpTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ LeaderboardsComponent, ModalComponent, PaginationComponent, LoginComponent, MyPicksComponent ],
			imports: [ FormsModule, HttpModule, HttpClientModule, RouterTestingModule.withRoutes([{path:'login', component: LoginComponent},{path:'mypicks', component: MyPicksComponent}]), ToastrModule.forRoot(), BrowserAnimationsModule, HttpClientTestingModule ],
			providers: [ ToastrService ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LeaderboardsComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		httpMock = fixture.debugElement.injector.get(HttpTestingController);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		fixture.detectChanges();
	});

	it('should call getStandings error', () => {
		spyOn(component, 'getStandings').and.callThrough();
		component.getStandings();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
	});

	it('should call getStandings not success', () => {
		spyOn(component, 'getStandings').and.callThrough();
		component.getStandings();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
	});

	it('should call getStandings success, updateLeaderboards no token', () => {
		spyOn(component, 'getStandings').and.callThrough();
		let navigateSpy = spyOn((<any>component).router, 'navigate');
		localStorage.removeItem('jwtToken');
		component.getStandings();
		const req = httpMock.expectOne(`/api/getstandings`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, standings: 'test'});
		httpMock.verify();
		expect(component.standings).toBe('test');
		expect(navigateSpy).toHaveBeenCalledWith(['login']);
	});

	it('should call openCreateModal', () => {
		spyOn(component, 'openCreateModal').and.callThrough();
		component.openCreateModal();
		expect(component.openCreateModal).toHaveBeenCalled();
	});

	it('should call openJoinModal', () => {
		spyOn(component, 'openJoinModal').and.callThrough();
		component.openJoinModal();
		expect(component.openJoinModal).toHaveBeenCalled();
	});

	it('should call openDeleteModal', () => {
		spyOn(component, 'openDeleteModal').and.callThrough();
		component.openDeleteModal();
		expect(component.openDeleteModal).toHaveBeenCalled();
	});

	it('should call openLeaveModal', () => {
		spyOn(component, 'openLeaveModal').and.callThrough();
		component.openLeaveModal();
		expect(component.openLeaveModal).toHaveBeenCalled();
	});

	it('should call closeDeleteLeaderboard', () => {
		spyOn(component, 'closeDeleteLeaderboard').and.callThrough();
		component.closeDeleteLeaderboard();
		expect(component.closeDeleteLeaderboard).toHaveBeenCalled();
	});

	it('should call closeLeaveLeaderboard', () => {
		spyOn(component, 'closeLeaveLeaderboard').and.callThrough();
		component.closeLeaveLeaderboard();
		expect(component.closeLeaveLeaderboard).toHaveBeenCalled();
	});

	it('should call updateLeaderboards token', () => {
		spyOn(component, 'updateLeaderboards').and.callThrough();
		var temp = window.btoa('{"leaderboards":["test"],"username":"test"}');
		localStorage.setItem('jwtToken','test.'+temp);
		component.updateLeaderboards('test');
		expect(component.updateLeaderboards).toHaveBeenCalled();
		expect(component.leaderboardCodes).toEqual(['test']);
		expect(component.username).toBe('test');
	});

	it('should call createLeaderboard error', () => {
		spyOn(component, 'createLeaderboard').and.callThrough();
		component.createLeaderboard();
		const req = httpMock.expectOne(`/api/createleaderboard`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.createLeaderboard).toHaveBeenCalled();
	});

	it('should call createLeaderboard not success', () => {
		spyOn(component, 'createLeaderboard').and.callThrough();
		component.createLeaderboard();
		const req = httpMock.expectOne(`/api/createleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.createLeaderboard).toHaveBeenCalled();
	});

	it('should call createLeaderboard success', () => {
		spyOn(component, 'createLeaderboard').and.callThrough();
		var temp = window.btoa('{"leaderboards":["test"],"username":"test"}');
		component.createLeaderboard();
		const req = httpMock.expectOne(`/api/createleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, token: 'test.'+temp});
		expect(component.createLeaderboard).toHaveBeenCalled();
		expect(component.newLeaderboardName).toBe('');
	});

	it('should call closeCreateLeaderboard', () => {
		spyOn(component, 'closeCreateLeaderboard').and.callThrough();
		component.closeCreateLeaderboard();
		expect(component.closeCreateLeaderboard).toHaveBeenCalled();
	});

	it('should call joinLeaderboard error', () => {
		spyOn(component, 'joinLeaderboard').and.callThrough();
		component.joinLeaderboard();
		const req = httpMock.expectOne(`/api/joinleaderboard`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.joinLeaderboard).toHaveBeenCalled();
	});

	it('should call joinLeaderboard not success', () => {
		spyOn(component, 'joinLeaderboard').and.callThrough();
		component.joinLeaderboard();
		const req = httpMock.expectOne(`/api/joinleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.joinLeaderboard).toHaveBeenCalled();
	});

	it('should call joinLeaderboard success', () => {
		spyOn(component, 'joinLeaderboard').and.callThrough();
		var temp = window.btoa('{"leaderboards":["test"],"username":"test"}');
		component.joinLeaderboard();
		const req = httpMock.expectOne(`/api/joinleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, token: 'test.'+temp});
		expect(component.joinLeaderboard).toHaveBeenCalled();
		expect(component.joinLeaderboardCode).toBe('');
	});

	it('should call closeJoinLeaderboard', () => {
		spyOn(component, 'closeJoinLeaderboard').and.callThrough();
		component.closeJoinLeaderboard();
		expect(component.closeJoinLeaderboard).toHaveBeenCalled();
	});

	it('should call getLeaderboards error', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('test');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboards error', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('test');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboards not success', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('test');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboards success all', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('all');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, results:[{code:'test'}]});
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboards success create', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('create');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, results:[{code:'test'}]});
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboards success else', () => {
		spyOn(component, 'getLeaderboards').and.callThrough();
		component.getLeaderboards('test');
		const req = httpMock.expectOne(`/api/getleaderboards`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, results:[{code:'a'},{code:'test'}]});
		expect(component.getLeaderboards).toHaveBeenCalled();
	});

	it('should call getLeaderboard alreadyLoaded total < 21', () => {
		spyOn(component, 'getLeaderboard').and.callThrough();
		component.loadedLeaderboards = [{code:'a',users:[]},{code:'test',users:[]}];
		component.getLeaderboard({code:'test'});
		expect(component.getLeaderboard).toHaveBeenCalled();
		expect(component.currentLeaderboard).toEqual({code:'test',users:[]});
		expect(component.total).toBe(0);
	});

	it('should call getLeaderboard alreadyLoaded total > 21', () => {
		spyOn(component, 'getLeaderboard').and.callThrough();
		component.loadedLeaderboards = [{code:'a',users:[]},{code:'test',users:['','','','','','','','','','','','','','','','','','','','','','']}];
		component.getLeaderboard({code:'test'});
		expect(component.getLeaderboard).toHaveBeenCalled();
		expect(component.currentLeaderboard).toEqual({code:'test',users:['','','','','','','','','','','','','','','','','','','','','','']});
		expect(component.total).toBe(22);
	});

	it('should call getLeaderboard error', () => {
		spyOn(component, 'getLeaderboard').and.callThrough();
		component.getLeaderboard('test');
		const req = httpMock.expectOne(`/api/getleaderboard`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.getLeaderboard).toHaveBeenCalled();
	});

	it('should call getLeaderboard not success', () => {
		spyOn(component, 'getLeaderboard').and.callThrough();
		component.getLeaderboard('test');
		const req = httpMock.expectOne(`/api/getleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.getLeaderboard).toHaveBeenCalled();
	});

	it('should call getLeaderboard success', () => {
		spyOn(component, 'getLeaderboard').and.callThrough();
		component.standings = {
			'naTeams':[{'teams':['tl'],'record':'4 - 0'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['c9','fly'],'record':'3 - 1'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['100','cg','ggs','tsm'],'record':'2 - 2'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['clg','fox'],'record':'1 - 3'},{'teams':['opt'],'record':'0 - 4'}],
			'euTeams':[{'teams':['fnc'],'record':'4 - 0'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['g2','vit'],'record':'3 - 1'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['xl','msf','og','spy'],'record':'2 - 2'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['rog','s04'],'record':'1 - 3'},{'teams':['sk'],'record':'0 - 4'}]
		};
		component.getLeaderboard({name:'test',code:'test',owner:'test'});
		const req = httpMock.expectOne(`/api/getleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, results: [{username:'test', picks:{
			'naTeams':[{'name':'100 Thieves','abbr':'100'},{'name':'Cloud 9','abbr':'c9'},{'name':'Clutch Gaming','abbr':'cg'},{'name':'Counter Logic Gaming','abbr':'clg'},{'name':'Flyquest','abbr':'fly'},{'name':'Echo Fox','abbr':'fox'},{'name':'Golden Guardians','abbr':'ggs'},{'name':'Optic Gaming','abbr':'opt'},{'name':'Team Liquid','abbr':'tl'},{'name':'Team Solo Mid','abbr':'tsm'}],
			'euTeams':[{'name':'Excel Esports','abbr':'xl'},{'name':'Fnatic','abbr':'fnc'},{'name':'G2 Esports','abbr':'g2'},{'name':'Misfits Gaming','abbr':'msf'},{'name':'Origen','abbr':'og'},{'name':'Rogue','abbr':'rog'},{'name':'Schalke 04','abbr':'s04'},{'name':'SK Gaming','abbr':'sk'},{'name':'Splyce','abbr':'spy'},{'name':'Team Vitality','abbr':'vit'}]
		}},
		{username:'test2', picks:{
			'naTeams':[{'name':'100 Thieves','abbr':'100'},{'name':'Cloud 9','abbr':'c9'},{'name':'Clutch Gaming','abbr':'cg'},{'name':'Counter Logic Gaming','abbr':'clg'},{'name':'Flyquest','abbr':'fly'},{'name':'Echo Fox','abbr':'fox'},{'name':'Golden Guardians','abbr':'ggs'},{'name':'Optic Gaming','abbr':'opt'},{'name':'Team Liquid','abbr':'tl'},{'name':'Team Solo Mid','abbr':'tsm'}],
			'euTeams':[{'name':'Fnatic','abbr':'fnc'},{'name':'Excel Esports','abbr':'xl'},{'name':'G2 Esports','abbr':'g2'},{'name':'Misfits Gaming','abbr':'msf'},{'name':'Origen','abbr':'og'},{'name':'Rogue','abbr':'rog'},{'name':'Schalke 04','abbr':'s04'},{'name':'SK Gaming','abbr':'sk'},{'name':'Splyce','abbr':'spy'},{'name':'Team Vitality','abbr':'vit'}]
		}}]});
		httpMock.verify();
		var currentLeaderboard = {name:'test',code:'test',owner:'test',users:[{username:'test2', picks:{
			'naTeams':[{'name':'100 Thieves','abbr':'100'},{'name':'Cloud 9','abbr':'c9'},{'name':'Clutch Gaming','abbr':'cg'},{'name':'Counter Logic Gaming','abbr':'clg'},{'name':'Flyquest','abbr':'fly'},{'name':'Echo Fox','abbr':'fox'},{'name':'Golden Guardians','abbr':'ggs'},{'name':'Optic Gaming','abbr':'opt'},{'name':'Team Liquid','abbr':'tl'},{'name':'Team Solo Mid','abbr':'tsm'}],
			'euTeams':[{'name':'Fnatic','abbr':'fnc'},{'name':'Excel Esports','abbr':'xl'},{'name':'G2 Esports','abbr':'g2'},{'name':'Misfits Gaming','abbr':'msf'},{'name':'Origen','abbr':'og'},{'name':'Rogue','abbr':'rog'},{'name':'Schalke 04','abbr':'s04'},{'name':'SK Gaming','abbr':'sk'},{'name':'Splyce','abbr':'spy'},{'name':'Team Vitality','abbr':'vit'}]
		}, points: 12},
		{username:'test', picks:{
			'naTeams':[{'name':'100 Thieves','abbr':'100'},{'name':'Cloud 9','abbr':'c9'},{'name':'Clutch Gaming','abbr':'cg'},{'name':'Counter Logic Gaming','abbr':'clg'},{'name':'Flyquest','abbr':'fly'},{'name':'Echo Fox','abbr':'fox'},{'name':'Golden Guardians','abbr':'ggs'},{'name':'Optic Gaming','abbr':'opt'},{'name':'Team Liquid','abbr':'tl'},{'name':'Team Solo Mid','abbr':'tsm'}],
			'euTeams':[{'name':'Excel Esports','abbr':'xl'},{'name':'Fnatic','abbr':'fnc'},{'name':'G2 Esports','abbr':'g2'},{'name':'Misfits Gaming','abbr':'msf'},{'name':'Origen','abbr':'og'},{'name':'Rogue','abbr':'rog'},{'name':'Schalke 04','abbr':'s04'},{'name':'SK Gaming','abbr':'sk'},{'name':'Splyce','abbr':'spy'},{'name':'Team Vitality','abbr':'vit'}]
		}, points: 10}]};
		expect(component.getLeaderboard).toHaveBeenCalled();
		expect(component.currentLeaderboard).toEqual(currentLeaderboard);
		expect(component.loadedLeaderboards).toEqual([currentLeaderboard]);
	});

	it('should call deleteLeaderboard error', () => {
		spyOn(component, 'deleteLeaderboard').and.callThrough();
		component.deleteLeaderboard('test');
		const req = httpMock.expectOne(`/api/deleteleaderboard`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.deleteLeaderboard).toHaveBeenCalled();
	});

	it('should call deleteLeaderboard not success', () => {
		spyOn(component, 'deleteLeaderboard').and.callThrough();
		component.deleteLeaderboard('test');
		const req = httpMock.expectOne(`/api/deleteleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.deleteLeaderboard).toHaveBeenCalled();
	});

	it('should call deleteLeaderboard success', () => {
		spyOn(component, 'deleteLeaderboard').and.callThrough();
		component.deleteLeaderboard('test');
		const req = httpMock.expectOne(`/api/deleteleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, msg: 'Successfully deleted leaderboard'});
		expect(component.deleteLeaderboard).toHaveBeenCalled();
		expect(component.currentLeaderboard).toBe(null);
		expect(component.total).toBe(0);
	});

	it('should call leaveLeaderboard error', () => {
		spyOn(component, 'leaveLeaderboard').and.callThrough();
		component.leaveLeaderboard('test');
		const req = httpMock.expectOne(`/api/leaveleaderboard`);
		expect(req.request.method).toBe('POST');
		req.error(new ErrorEvent('error'));
		httpMock.verify();
		expect(component.leaveLeaderboard).toHaveBeenCalled();
	});

	it('should call leaveLeaderboard not success', () => {
		spyOn(component, 'leaveLeaderboard').and.callThrough();
		component.leaveLeaderboard('test');
		const req = httpMock.expectOne(`/api/leaveleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: false, msg: 'Error'});
		httpMock.verify();
		expect(component.leaveLeaderboard).toHaveBeenCalled();
	});

	it('should call leaveLeaderboard success', () => {
		spyOn(component, 'leaveLeaderboard').and.callThrough();
		var temp = window.btoa('{"leaderboards":["test"],"username":"test"}');
		component.leaveLeaderboard('test');
		const req = httpMock.expectOne(`/api/leaveleaderboard`);
		expect(req.request.method).toBe('POST');
		req.flush({success: true, msg: 'Left leaderboard', token: 'test.'+temp});
		expect(component.leaveLeaderboard).toHaveBeenCalled();
		expect(component.currentLeaderboard).toBe(null);
		expect(component.total).toBe(0);
	});

	it('should call openUser', () => {
		spyOn(component, 'openUser').and.callThrough();
		component.openUser('test');
		expect(component.openUser).toHaveBeenCalled();
	});

	it('should call goToPage', () => {
		spyOn(component, 'goToPage').and.callThrough();
		component.goToPage(2);
		expect(component.goToPage).toHaveBeenCalled();
		expect(component.page).toBe(2);
		expect(component.pageMin).toBe(20);
		expect(component.pageMax).toBe(40);
	});

	it('should call onNext', () => {
		spyOn(component, 'onNext').and.callThrough();
		component.page = 1;
		component.pageMin = 0;
		component.pageMax = 20;
		component.onNext();
		expect(component.onNext).toHaveBeenCalled();
		expect(component.page).toBe(2);
		expect(component.pageMin).toBe(20);
		expect(component.pageMax).toBe(40);
	});

	it('should call onPrev', () => {
		spyOn(component, 'onPrev').and.callThrough();
		component.page = 2;
		component.pageMin = 20;
		component.pageMax = 40;
		component.onPrev();
		expect(component.onPrev).toHaveBeenCalled();
		expect(component.page).toBe(1);
		expect(component.pageMin).toBe(0);
		expect(component.pageMax).toBe(20);
	});

});
