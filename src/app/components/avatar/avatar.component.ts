import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})

export class AvatarComponent {

  @Input() public role: string = 'ADMIN_ROLE';
  @Input() public destino: string = 'general'; // general | tabla

  constructor() {}

}
