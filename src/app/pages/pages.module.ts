import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PerfilComponent } from './perfil/perfil.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { ObrasMaderaComponent } from './obras-madera/obras-madera.component';
import { ObrasMaderaDetallesComponent } from './obras-madera/obras-madera-detalles.component';
import { ObrasMaderaMotivosPasesComponent } from './obras-madera/obras-madera-motivos-pases.component';
import { TiposMueblesComponent } from './obras-madera/tipos-muebles.component';
import { TiposPlacasComponent } from './obras-madera/tipos-placas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar-password.component';
import { DirectivesModule } from '../directives/directives.module';
import { HomeComponent } from './home/home.component';
import { OrdenesMatenimientoMaderaComponent } from './obras-madera/ordenes-matenimiento.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    PerfilComponent,
    ClientesComponent,
    ObrasMaderaComponent,
    ObrasMaderaDetallesComponent,
    ObrasMaderaMotivosPasesComponent,
    TiposMueblesComponent,
    TiposPlacasComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    EditarPasswordComponent,
    OrdenesMatenimientoMaderaComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [
  ]
})
export class PagesModule { }
