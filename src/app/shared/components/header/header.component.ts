import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	constructor(private router: Router) { }

	goToPicks() {
		this.router.navigate(['mypicks']);
	}

	goToLeaderboards() {
		this.router.navigate(['leaderboards']);
	}

	logout() {
		localStorage.removeItem('jwtToken');
		this.router.navigate(['login']);
	}
}