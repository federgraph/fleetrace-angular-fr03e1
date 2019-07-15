import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule  } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { HelpComponent } from './help/help.component';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';
import { FormEventParamsQuickComponent } from './form-event-params-quick/form-event-params-quick.component';
import { FormEventPropsQuickComponent } from './form-event-props-quick/form-event-props-quick.component';
import { BibComponent } from './bib/bib.component';
import { JsonInfoComponent } from './json-info/json-info.component';
import { IconLegendComponent } from './icon-legend/icon-legend.component';
import { IconBarLegendComponent } from './icon-bar-legend/icon-bar-legend.component';
import { FeaturedEventComponent } from './featured-event/featured-event.component';
import { ResultHashComponent } from './result-hash/result-hash.component';
import { ResultUploadComponent } from './result-upload/result-upload.component';

import { TIniImage } from '../fr/fr-ini-image';
import { TMainParams } from '../bo/bo-main-params';
import { TBOParams } from '../bo/bo-params';
import { TMsgToken } from '../bo/bo-msg-token';
import { TBOManager } from '../bo/bo-manager';

import { ONLINE_SERVICES } from './shared/services';
import { ApiComponent } from './api/api.component';
import { ConnectionControlComponent } from './connection-control/connection-control.component';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    BibComponent,
    HelpComponent,
    TimingButtonsComponent,
    FormEventParamsQuickComponent,
    FormEventPropsQuickComponent,
    JsonInfoComponent,
    IconLegendComponent,
    IconBarLegendComponent,
    FeaturedEventComponent,
    ResultHashComponent,
    ResultUploadComponent,
    ApiComponent,
    ConnectionControlComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSnackBarModule,
    MatBadgeModule,
  ],
  providers: [
    TIniImage,
    TMainParams,
    TBOParams,
    TMsgToken,
    TBOManager,
    ONLINE_SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
