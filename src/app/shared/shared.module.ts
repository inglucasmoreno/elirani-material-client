import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from '../app-routing.module';
import { ItemsComponent } from './sidebar/components/items/items.component';
import { DirectivesModule } from '../directives/directives.module';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    SidebarComponent,
    ItemsComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    LoaderComponent,
  ]
})
export class SharedModule { }
