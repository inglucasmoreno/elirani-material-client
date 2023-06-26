import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { AppRoutingModule } from '../app-routing.module';
import { DirectivesModule } from '../directives/directives.module';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { LayoutComponent } from './layout/layout.component';

// Material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

// Modales
import { ModalTiposPlacasMaderaComponent } from './modals/modal-tipos-placas-madera/modal-tipos-placas-madera.component';
import { ModalObrasMaderaMotivosPasesComponent } from './modals/modal-obras-madera-motivos-pases/modal-obras-madera-motivos-pases.component';
import { ModalTiposMueblesComponent } from './modals/modal-tipos-muebles/modal-tipos-muebles.component';
import { ModalOrdenesMantenimientoComponent } from './modals/modal-ordenes-mantenimiento/modal-ordenes-mantenimiento.component';
import { ModalClientesComponent } from './modals/modal-clientes/modal-clientes.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalUsuariosComponent } from './modals/modal-usuarios/modal-usuarios.component';
import { ModalCambioPasswordComponent } from './modals/modal-cambio-password/modal-cambio-password.component';
import { ModalCambioPermisosComponent } from './modals/modal-cambio-permisos/modal-cambio-permisos.component';
import { ModalPerfilComponent } from './modals/modal-perfil/modal-perfil.component';
import { ModalObrasMaderaComponent } from './modals/modal-obras-madera/modal-obras-madera.component';
import { ModalMueblesComponent } from './modals/modal-muebles/modal-muebles.component';
import { ModalObrasMaderaPasesComponent } from './modals/modal-obras-madera-pases/modal-obras-madera-pases.component';

@NgModule({
  declarations: [
    LoaderComponent,
    LayoutComponent,
    ModalTiposPlacasMaderaComponent,
    ModalObrasMaderaMotivosPasesComponent,
    ModalTiposMueblesComponent,
    ModalOrdenesMantenimientoComponent,
    ModalClientesComponent,
    ModalUsuariosComponent,
    ModalCambioPasswordComponent,
    ModalCambioPermisosComponent,
    ModalPerfilComponent,
    ModalObrasMaderaComponent,
    ModalMueblesComponent,
    ModalObrasMaderaPasesComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule,
    PipesModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSlideToggleModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    LoaderComponent,
    LayoutComponent,
    ModalTiposPlacasMaderaComponent,
    ModalObrasMaderaMotivosPasesComponent
  ]
})
export class SharedModule { }
