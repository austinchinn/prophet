import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	registerData = {username:'', password:''};
	loginData = {username:'', password:''};
	data: any;

	@ViewChild('registerModal') registerModal: ModalComponent;

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

	ngOnInit() {
	}

	login() {
		this.http.post('/api/signin',this.loginData).subscribe(res => {
			this.data = res;
			if(!this.data.success){
				this.toastr.error(this.data.msg);
			}
			else{
				localStorage.setItem('jwtToken', this.data.token);
				this.router.navigate(['mypicks']);
			}
		}, err => {
			this.toastr.error('Server down');
		});
	}

	openModal() {
		this.registerModal.show();
	}


	// register() {
	// 	this.http.post('/api/register',this.registerData).subscribe(res => {
	// 		this.data = res;
	// 		if(!this.data.success){
	// 			this.toastr.error(this.data.msg);
	// 		}
	// 		else{
	// 			this.registerModal.hide();
	// 			this.registerData = {username:'', password:''};
	// 			this.toastr.success('Successfully registered!')
	// 		}
	// 	}, err => {
	// 		this.toastr.error('Server down');
	// 	});
	// }

	closeRegister() {
		this.registerModal.hide();
		this.registerData = {username:'', password:''};
	}
}
