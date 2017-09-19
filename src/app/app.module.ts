import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GlobalService } from './services/global.service';
import { ListingsService } from './services/listings.service';
import { SettingsService } from './services/settings.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SettingsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgxChartsModule,
		BrowserAnimationsModule
	],
	providers: [
		Title,
		GlobalService,
		ListingsService,
		SettingsService
	],
	bootstrap: [AppComponent]
})

export class AppModule
{
	
}