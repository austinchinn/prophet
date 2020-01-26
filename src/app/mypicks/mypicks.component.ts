import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ToastrService } from 'ngx-toastr';
import { DragulaService } from 'ng2-dragula'

@Component({
	selector: 'mypicks',
	templateUrl: './mypicks.component.html',
	styleUrls: ['./mypicks.component.css']
})
export class MyPicksComponent implements OnInit {
	naTeams: Array<any> = [];
	euTeams: Array<any> = [];
	username: String;
	data: any;
	changed: Boolean = false;
	points: number = 0;
	naPlacements: Array<any> = [];
	euPlacements: Array<any> = [];
	standings: any;
	editMode: Boolean = false;

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private dragula: DragulaService) { }

	ngOnInit() {
		var token = localStorage.getItem('jwtToken');
		if(!token){
			this.router.navigate(['login']);
		}
		else{
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			var data = JSON.parse(window.atob(base64));
			
			this.http.post('/api/getstandings',null).subscribe(res => {
				this.data = res;
				if(this.data.success){
					this.standings = this.data.standings;
					for(var i = 0; i < 10; i++){
						var naRecord = '';
						var euRecord = '';
						for(var j = 0; j < 10; j++){
							if(this.standings.naTeams[j].teams.indexOf(data.picks.naTeams[i].name.toUpperCase()) > -1){
								naRecord = this.standings.naTeams[j].record;
								this.naPlacements.push(j+1);
								break;
							}
						}
						for(var j = 0; j < 10; j++){
							if(this.standings.euTeams[j].teams.indexOf(data.picks.euTeams[i].name.toUpperCase()) > -1){
								euRecord = this.standings.euTeams[j].record;
								this.euPlacements.push(j+1);
								break;
							}
						}
						this.naTeams.push({
							'name':data.picks.naTeams[i].name,
							'abbr':data.picks.naTeams[i].abbr,
							'record':naRecord,
							'correct':false
						});
						this.euTeams.push({
							'name':data.picks.euTeams[i].name,
							'abbr':data.picks.euTeams[i].abbr,
							'record':euRecord,
							'correct':false
						});
					}
					// this.naTeams = data.picks.naTeams;
					// this.euTeams = data.picks.euTeams;
					this.username = data.username;

					for(var j = 0; j < 10; j++){
						if(this.standings.naTeams[j].teams.indexOf(this.naTeams[j].name.toUpperCase()) > -1){
							this.points += 2;
							this.naTeams[j].correct = true;
						}
						if(this.standings.euTeams[j].teams.indexOf(this.euTeams[j].name.toUpperCase()) > -1){
							this.points += 2;
							this.euTeams[j].correct = true;
						}
					}
				}
				else{
					this.toastr.error('Error with database');
				}
			},
			err => {
				console.log(err);
			});

			this.changed = false;
			this.dragula.drop('naTeams').subscribe(({}) => {
				this.changed = true;
			});
			this.dragula.drop('euTeams').subscribe(({}) => {
				this.changed = true;
			});

		}
	}

	saveOrder() {
		const headers = {
			headers: new HttpHeaders({
				'Authorization': localStorage.getItem('jwtToken')
			})
		};
		var data = {
			'username':this.username,
			'picks':{
				'naTeams':this.naTeams,
				'euTeams':this.euTeams
			}
		}
		this.http.post('/api/savepicks',data,headers).subscribe(res => {
			this.data = res;
			localStorage.setItem('jwtToken', this.data.token);
			this.changed = false;
			this.toastr.success('Picks saved!');
		},
		err => {
			console.log(err);
		});
	}

	copyLink() {
		(<HTMLInputElement>document.getElementById('userLink')).select();
		document.execCommand('copy');
	}

	toLive() {
		if(!this.editMode){
			var token = localStorage.getItem('jwtToken');
			if(!token){
				this.router.navigate(['login']);
			}
			else{
				var base64Url = token.split('.')[1];
				var base64 = base64Url.replace('-', '+').replace('_', '/');
				var data = JSON.parse(window.atob(base64));
				
				this.naTeams = [];
				this.euTeams = [];
				this.naPlacements = [];
				this.euPlacements = [];

				for(var i = 0; i < 10; i++){
					var naRecord = '';
					var euRecord = '';

					for(var j = 0; j < 10; j++){
						if(this.standings.naTeams[j].teams.indexOf(data.picks.naTeams[i].name.toUpperCase()) > -1){
							naRecord = this.standings.naTeams[j].record;
							this.naPlacements.push(j+1);
							break;
						}
					}
					for(var j = 0; j < 10; j++){
						if(this.standings.euTeams[j].teams.indexOf(data.picks.euTeams[i].name.toUpperCase()) > -1){
							euRecord = this.standings.euTeams[j].record;
							this.euPlacements.push(j+1);
							break;
						}
					}

					this.naTeams.push({
						'name':data.picks.naTeams[i].name,
						'abbr':data.picks.naTeams[i].abbr,
						'record':naRecord,
						'correct':false
					});
					this.euTeams.push({
						'name':data.picks.euTeams[i].name,
						'abbr':data.picks.euTeams[i].abbr,
						'record':euRecord,
						'correct':false
					});
				}

				this.points = 0;
				for(var j = 0; j < 10; j++){
					if(this.standings.naTeams[j].teams.indexOf(this.naTeams[j].name.toUpperCase()) > -1){
						this.points += 2;
						this.naTeams[j].correct = true;
					}
					if(this.standings.euTeams[j].teams.indexOf(this.euTeams[j].name.toUpperCase()) > -1){
						this.points += 2;
						this.euTeams[j].correct = true;
					}
				}
			}
		}
	}
}