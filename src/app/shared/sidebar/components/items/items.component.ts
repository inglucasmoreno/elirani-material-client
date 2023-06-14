import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  constructor() { }

  @Input() item?: string;
  @Input() route?: string;
  @Input() routerLinkActive: string = 'bg-secondaryColor rounded';
  @Input() svg?: string;

  ngOnInit(): void {}

}
