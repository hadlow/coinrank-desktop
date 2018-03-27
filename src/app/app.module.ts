import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { NgxElectronModule } from 'ngx-electron';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { ListingsService } from './services/listings.service';
import { SettingsService } from './services/settings.service';
import { DetailService } from './services/detail.service';
import { NewsService } from './services/news.service';

import { SafePipe } from './pipes/safe.pipe';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { CoinComponent } from './coin/coin.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	declarations: [
		SafePipe,
		AppComponent,
		SettingsComponent,
		CoinComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		AmChartsModule,
		NgxElectronModule,
		PerfectScrollbarModule
	],
	providers: [
		Title,
		ListingsService,
		SettingsService,
		DetailService,
		NewsService,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	],
	bootstrap: [AppComponent]
})

export class AppModule
{
	
}