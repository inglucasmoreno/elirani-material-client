import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from '../guards/auth.guard';
import { PermisosGuard } from '../guards/permisos.guard';

// Generales
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';

// Usuarios
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar-password.component';

// Clientes
import { ClientesComponent } from './clientes/clientes.component';

// Obras Madera
import { ObrasMaderaComponent } from './obras-madera/obras-madera.component';
import { TiposMueblesComponent } from './obras-madera/tipos-muebles.component';
import { TiposPlacasComponent } from './obras-madera/tipos-placas.component';
import { ObrasMaderaDetallesComponent } from './obras-madera/obras-madera-detalles.component';
import { ObrasMaderaMotivosPasesComponent } from './obras-madera/obras-madera-motivos-pases.component';
import { OrdenesMatenimientoMaderaComponent } from './obras-madera/ordenes-matenimiento.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],    // Guard - Se verifica si el usuario esta logueado
        children: [
            
            // Home
            { path: 'home', component: HomeComponent },

            // Perfil de usuarios
            { path: 'perfil', component: PerfilComponent },

            // Usuarios
            { path: 'usuarios', data: { permisos: ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'] }, canActivate: [PermisosGuard], component: UsuariosComponent },
            { path: 'usuarios/nuevo', data: { permisos: ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'] }, canActivate: [PermisosGuard], component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', data: { permisos: ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'] }, canActivate: [PermisosGuard], component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', data: { permisos: ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'] }, canActivate: [PermisosGuard], component: EditarPasswordComponent },

            // Clientes
            { path: 'clientes', data: { permisos: ['CLIENTES_ALL', 'CLIENTES_READ'] }, canActivate: [PermisosGuard], component: ClientesComponent },

            // Madera
            { path: 'obras-madera', data: { permisos: ['MADERA_ALL', 'MADERA_READ'] }, canActivate: [PermisosGuard], component: ObrasMaderaComponent },
            { path: 'obras-madera/detalles/:id', data: { permisos: ['MADERA_ALL', 'MADERA_READ'] }, canActivate: [PermisosGuard], component: ObrasMaderaDetallesComponent },
            { path: 'ordenes-mantenimiento-madera', data: { permisos: ['MADERA_ALL', 'MADERA_READ'] }, canActivate: [PermisosGuard], component: OrdenesMatenimientoMaderaComponent },
            { path: 'tipos-muebles', data: { permisos: ['CONFIG_MADERA_ALL', 'CONFIG_MADERA_READ'] }, canActivate: [PermisosGuard], component: TiposMueblesComponent },
            { path: 'tipos-placas', data: { permisos: ['CONFIG_MADERA_ALL', 'CONFIG_MADERA_READ'] }, canActivate: [PermisosGuard], component: TiposPlacasComponent },
            { path: 'obras-madera-motivos-pases', data: { permisos: ['CONFIG_MADERA_ALL', 'CONFIG_MADERA_READ'] }, canActivate: [PermisosGuard], component: ObrasMaderaMotivosPasesComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}