import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ListingsService } from './services/listings.service';
import { SettingsService } from './services/settings.service';
import { DetailService } from './services/detail.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SettingsComponent,
		FooterComponent
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
		ListingsService,
		SettingsService,
		DetailService
	],
	bootstrap: [AppComponent]
})

export class AppModule
{
	
}