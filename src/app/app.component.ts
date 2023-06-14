import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  isDarkThemeActive = false;
  title = 'elirani-client';

  public onChange(newValue: Boolean): void {
    console.log(newValue);
  }

}
