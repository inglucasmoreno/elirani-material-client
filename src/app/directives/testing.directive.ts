import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appTesting]'
})
export class TestingDirective {

  public usuarioLogin: any;
  public permisos: any = ['todo'];

  constructor(
    // private readonly eleRef: ElementRef,
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    console.log(this.permisos);
    console.log(this.usuarioLogin.permisos);
    this.actualizarVista();
  }

  @Input() // -> Se reciben los permisos
  set appTesting(val: Array<string>) {
    this.permisos = val;
    // this.actualizarVista();
  }

  private actualizarVista(): void {
    this.viewContainer.clear(); // Limpia la vista
    if(this.comprobarPermisos()){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private comprobarPermisos(): boolean {
    if(this.usuarioLogin && this.usuarioLogin.role === 'ADMIN_ROLE'){

      let tienePermiso = false;
     
      if(this.usuarioLogin && this.usuarioLogin.permisos){ // Si existe testing - Reemplazar por datos de usuario
        
        for (const checkPermisos of this.permisos) {
          
          const coincide = this.usuarioLogin.permisos.find( (p: string) => {
            return (p.toUpperCase() === checkPermisos.toUpperCase());
          });
          
          if(coincide) {  // Si hay coincidencia se devuelve true y se finaliza el bucle
            tienePermiso = true;
            break
          }
  
        }  
      
      }

      return true;
    
    }else{
    
      return false;
    
    }
  }

}
