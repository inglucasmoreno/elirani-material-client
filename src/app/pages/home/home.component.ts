import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import gsap from 'gsap';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  public permisos = ['CLIENTES_ALL'];
  public texto = "";

  constructor( 
    private dataService: DataService,
    private alertService: AlertService  
  ) {}

  ngOnInit(): void { 
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Home';
  }

  focus(): void {
    const element = document.getElementById('entrada');
    if(element) element.focus();
    console.log(element);
  }
  
}
