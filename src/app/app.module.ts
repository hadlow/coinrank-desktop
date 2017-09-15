import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { GlobalService } from './services/global.service';
import { ListingsService } from './services/listings.service';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		NvD3Module
	],
	providers: [
		GlobalService,
		ListingsService
	],
	bootstrap: [AppComponent]
})

export class AppModule
{
	
}