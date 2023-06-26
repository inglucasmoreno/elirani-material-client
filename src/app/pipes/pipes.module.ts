import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { MonedaPipe } from './moneda.pipe';
import { RolPipe } from './rol.pipe';
import { FiltroUsuariosPipe } from './filtro-usuarios.pipe';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { CodigoMaderaPipe } from './codigo-madera.pipe';
import { FiltroPlacasMaderaPipe } from './filtro-placas-madera.pipe';
import { LimiteCaracteresPipe } from './limite-caracteres.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    MonedaPipe,
    RolPipe,
    FiltroUsuariosPipe,
    FiltroClientesPipe,
    CodigoMaderaPipe,
    FiltroPlacasMaderaPipe,
    LimiteCaracteresPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    MonedaPipe,
    RolPipe,
    FiltroUsuariosPipe,
    FiltroClientesPipe,
    CodigoMaderaPipe,
    FiltroPlacasMaderaPipe,
    LimiteCaracteresPipe
  ]
})
export class PipesModule { }
