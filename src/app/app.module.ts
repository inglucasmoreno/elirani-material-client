import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// Angular Material
import { ErrorPageComponent } from './error-page/error-page.component';
import { InicializacionComponent } from './inicializacion/inicializacion.component';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { DirectivesModule } from './directives/directives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    InicializacionComponent,
  ],
  imports: [

    // Angular
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    // Propios
    AuthModule,
    PagesModule,
    SharedModule,
    BrowserAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
