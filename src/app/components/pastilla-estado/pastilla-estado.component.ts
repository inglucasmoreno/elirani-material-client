import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pastilla-estado',
  templateUrl: './pastilla-estado.component.html',
  styleUrls: ['./pastilla-estado.component.scss']
})
export class PastillaEstadoComponent {
  
  constructor() { }

  @Input() activo: boolean = true;

  ngOnInit(): void {}

}
