import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { NgxElectronModule } from 'ngx-electron';

import { ListingsService } from './services/listings.service';
import { SettingsService } from './services/settings.service';
import { DetailService } from './services/detail.service';

import { SafePipe } from './pipes/safe.pipe';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
	declarations: [
		SafePipe,
		AppComponent,
		SettingsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		AmChartsModule,
		NgxElectronModule
	],
	providers: [
		Title,
		ListingsService,
		SettingsService,
		DetailService
	],
	bootstrap: [AppComponent]
})

export class AppModule
{
	
}