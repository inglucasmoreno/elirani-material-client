import { Component } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-tarjeta-lista',
  templateUrl: './tarjeta-lista.component.html',
  styleUrls: ['./tarjeta-lista.component.scss']
})
export class TarjetaListaComponent {

  constructor() {}

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
  }

}
