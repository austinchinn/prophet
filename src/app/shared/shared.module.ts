import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalComponent } from './components/modal/modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
	declarations: [ModalComponent, PaginationComponent, HeaderComponent],
	imports: [CommonModule, FormsModule, HttpModule],
	exports: [ModalComponent, PaginationComponent, HeaderComponent]
})
export class SharedModule { }