import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosDirective } from './permisos.directive';
import { TestingDirective } from './testing.directive';
import { AutoFocusDirective } from './auto-focus.directive';

@NgModule({
  declarations: [
    PermisosDirective,
    TestingDirective,
    AutoFocusDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermisosDirective,
    TestingDirective,
    AutoFocusDirective
  ]
})
export class DirectivesModule { }
