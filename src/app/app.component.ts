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
  isDarkMode: boolean = false;

  ngOnInit() {
    this.initializeThemeFromStorage();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    try {
      localStorage.setItem('app-theme', this.isDarkMode ? 'dark' : 'light');
    } catch { }
    this.applyTheme();
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  initializeThemeFromStorage() {
    try {
      const stored = localStorage.getItem('app-theme');
      this.isDarkMode = stored === 'dark';
      this.applyTheme();
    } catch {
      this.isDarkMode = false;
    }
  }

}
