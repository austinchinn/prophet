import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragulaModule } from 'ng2-dragula';
import { RouterModule, Routes } from '@angular/router';
import { MyPicksComponent } from './mypicks/mypicks.component';
import { SharedModule } from './shared/shared.module';
import { LeaderboardsComponent } from './leaderboards/leaderboards.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
	{
		path: 'mypicks',
		component: MyPicksComponent,
		data: { title: 'My Picks' }
	},
	{
		path: 'login',
		component: LoginComponent,
		data: { title: 'Login' }
	},
	{
		path: 'leaderboards',
		component: LeaderboardsComponent,
		data: { title: 'Leaderboards'}
	},
	{
		path: '',
		redirectTo :'/mypicks',
		pathMatch:'full'
	}
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		MyPicksComponent,
		LeaderboardsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		SharedModule,
		BrowserAnimationsModule,
		DragulaModule.forRoot(),
		RouterModule.forRoot(appRoutes),
		ToastrModule.forRoot({
			timeOut: 3000,
			positionClass: 'toast-top-center',
			maxOpened: 1,
			autoDismiss: true,
			preventDuplicates: true,
			resetTimeoutOnDuplicate: true
		})
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
