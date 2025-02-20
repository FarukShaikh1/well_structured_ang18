import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./components/shared/loader/loader.component";
import { ToasterComponent } from "./components/shared/toaster/toaster.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, ToasterComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyCollection';
}
