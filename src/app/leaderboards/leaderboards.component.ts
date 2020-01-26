import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'leaderboards',
	templateUrl: './leaderboards.component.html',
	styleUrls: ['./leaderboards.component.css']
})
export class LeaderboardsComponent implements OnInit {
	leaderboardCodes: Array<any> = [];
	leaderboards: Array<any> = [];
	username: String;
	data: any;
	newLeaderboardName: String;
	joinLeaderboardCode: String;
	currentLeaderboard: any;
	loadedLeaderboards: Array<any> = [];
	count: number = 0;
	standings: any;
	loading: Boolean = false;

	total: number = 0;
	page: number = 1;
	limit: number = 20;
	pageMin: number = 0;
	pageMax: number = 20;

	@ViewChild('createLeaderboardModal') createLeaderboardModal: ModalComponent;
	@ViewChild('joinLeaderboardModal') joinLeaderboardModal: ModalComponent;
	@ViewChild('deleteLeaderboardModal') deleteLeaderboardModal: ModalComponent;
	@ViewChild('leaveLeaderboardModal') leaveLeaderboardModal: ModalComponent;

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

	ngOnInit() {
		this.getStandings();
	}

	getStandings(){
		this.http.post('/api/getstandings',null).subscribe(res => {
			this.data = res;
			if(this.data.success){
				this.standings = this.data.standings;
				this.updateLeaderboards('all');
			}
			else{
				this.toastr.error('Error with database');
			}
		},
		err => {
			console.log(err);
		});
	}

	openCreateModal(){
		this.createLeaderboardModal.show();
	}

	openJoinModal(){
		this.joinLeaderboardModal.show();
	}

	openDeleteModal(){
		this.deleteLeaderboardModal.show();
	}

	openLeaveModal(){
		this.leaveLeaderboardModal.show();
	}

	closeDeleteLeaderboard(){
		this.deleteLeaderboardModal.hide();
	}

	closeLeaveLeaderboard(){
		this.leaveLeaderboardModal.hide();
	}

	updateLeaderboards(codeToDisplay){
		var token = localStorage.getItem('jwtToken');
		if(!token){
			this.router.navigate(['login']);
		}
		else{
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			var data = JSON.parse(window.atob(base64));
			this.leaderboardCodes = data.leaderboards;
			this.username = data.username;
			this.getLeaderboards(codeToDisplay);
		}
	}

	createLeaderboard(){
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'username':this.username,
			'name':this.newLeaderboardName
		}
		this.http.post('/api/createLeaderboard',data,headers).subscribe(res => {
			this.data = res;
			localStorage.setItem('jwtToken', this.data.token);
			this.createLeaderboardModal.hide();
			this.newLeaderboardName = '';
			this.toastr.success('Created leaderboard!');
			this.updateLeaderboards('create');
		},
		err => {
			console.log(err);
		});
	}

	closeCreateLeaderboard(){
		this.createLeaderboardModal.hide();
		this.newLeaderboardName = '';
	}

	joinLeaderboard(){
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'username':this.username,
			'code':this.joinLeaderboardCode
		}
		this.http.post('/api/joinLeaderboard',data,headers).subscribe(res => {
			this.data = res;
			if(this.data.success){
				localStorage.setItem('jwtToken', this.data.token);
				this.joinLeaderboardModal.hide();
				var temp = this.joinLeaderboardCode;
				this.joinLeaderboardCode = '';
				this.toastr.success(this.data.msg);
				this.updateLeaderboards(temp);
			}
			else{
				this.toastr.error(this.data.msg);
			}
		},
		err => {
			console.log(err);
		});
	}

	closeJoinLeaderboard(){
		this.joinLeaderboardModal.hide();
		this.joinLeaderboardCode = '';
	}

	getLeaderboards(codeToDisplay){
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'username':this.username,
			'leaderboardCodes':this.leaderboardCodes
		};
		this.http.post('/api/getleaderboards',data,headers).subscribe(res => {
			this.data = res;
			this.leaderboards = this.data.results;
			if(codeToDisplay === 'all'){
				this.getLeaderboard(this.leaderboards[0]);
			}
			else if(codeToDisplay === 'create'){
				this.getLeaderboard(this.leaderboards[this.leaderboards.length-1])
			}
			else{
				for(var i = 0; i < this.leaderboards.length; i++){
					if(this.leaderboards[i].code === codeToDisplay.toLowerCase()){
						this.getLeaderboard(this.leaderboards[i]);
					}
				}
			}
		},
		err => {
			console.log(err);
		});
	}

	getLeaderboard(leaderboard){
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'code':leaderboard.code
		};

		var alreadyLoaded = false;
		for(var i = 0; i < this.loadedLeaderboards.length; i++){
			if(this.loadedLeaderboards[i].code === leaderboard.code){
				this.currentLeaderboard = this.loadedLeaderboards[i];
				this.total = this.currentLeaderboard.users.length;
				if(this.total < 21){
					this.total = 0;
				}
				this.goToPage(1);
				alreadyLoaded = true;
				break;
			}
		}

		if(!alreadyLoaded){
			this.loading = true;
			this.http.post('/api/getleaderboard',data,headers).subscribe(res => {
				this.data = res;
				if(this.data.success){
					var orderedArray = [];
					for(var i = 0; i < this.data.results.length; i++){
						var points = 0;
						for(var j = 0; j < 10; j++){
							if(this.standings.naTeams[j].teams.indexOf(this.data.results[i].picks.naTeams[j].name.toUpperCase()) > -1){
								points += 2;
							}
							if(this.standings.euTeams[j].teams.indexOf(this.data.results[i].picks.euTeams[j].name.toUpperCase()) > -1){
								points += 2;
							}
						}
						orderedArray.push({
							'username':this.data.results[i].username,
							'picks':this.data.results[i].picks,
							'points': points
						})
					}

					orderedArray.sort(function(a,b){
						return b.points-a.points;
					})

					this.currentLeaderboard = {
						'name': leaderboard.name,
						'code': leaderboard.code,
						'owner': leaderboard.owner,
						'users': orderedArray
					};
					this.total = this.currentLeaderboard.users.length;
					if(this.total < 21){
						this.total = 0;
					}
					this.goToPage(1);
					this.loadedLeaderboards.push(this.currentLeaderboard);
					this.loading = false;
				}
			},
			err => {
				console.log(err);
				this.loading = false;
			});
		}
	}

	deleteLeaderboard(code){
		this.closeDeleteLeaderboard();
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'code':code
		};
		this.http.post('/api/deleteleaderboard',data,headers).subscribe(res => {
			this.data = res;
			if(this.data.success){
				this.currentLeaderboard = null;
				this.total = 0;
				this.toastr.success('Deleted leaderboard');
				this.updateLeaderboards('all');
			}
		},
		err => {
			console.log(err);
		});
	}

	leaveLeaderboard(code){
		this.closeLeaveLeaderboard();
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'username':this.username,
			'code':code
		};
		this.http.post('/api/leaveleaderboard',data,headers).subscribe(res => {
			this.data = res;
			if(this.data.success){
				localStorage.setItem('jwtToken', this.data.token);
				this.currentLeaderboard = null;
				this.total = 0;
				this.toastr.success('Left leaderboard');
				this.updateLeaderboards('all');
			}
		},
		err => {
			console.log(err);
		});
	}

	openUser(username) {
		window.open("https://prophetlol.herokuapp.com/user/"+username, "_blank");
	}

	goToPage(n: number): void {
		this.page = n;
		this.pageMin = (n-1)*20;
		this.pageMax = n*20;
	}

	onNext(): void {
		this.page++;
		this.pageMin += 20;
		this.pageMax += 20;
	}

	onPrev(): void {
		this.page--;
		this.pageMin -= 20;
		this.pageMax -= 20;
	}
}
