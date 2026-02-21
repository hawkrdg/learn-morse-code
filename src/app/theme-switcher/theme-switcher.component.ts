import { Component, model } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from "@angular/material/form-field";

const themes = [
  'blueGreyTheme',
  'brickTheme',
  'greenTheme',
  'greyTheme',
  'khakiTheme',
  'oliveTheme',
  // 'testTheme'
]

@Component({
  selector: 'app-theme-switcher',
  imports: [
    FormsModule,
    MatInputModule,
    // MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    // MatSidenavModule,
    // C1Component
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  themes = themes;
  currentTheme = model(themes[0]);
  currentLightDark = model('lightTheme');

    ngOnInit() {
    console.log('Main ngOnInit() fires...');
  }
  
  ngAfterViewInit() {
    console.log('Main ngAfterViewInit() fires...');
    const savedTheme = localStorage.getItem('theme');
    const savedLightDark = localStorage.getItem('lightDark');
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
      if (savedLightDark) {
        this.currentLightDark.set(savedLightDark);
      } else {
        this.currentLightDark.set('lightTheme');
      }
    } else {
      this.currentTheme.set(themes[0]);
    }
    setTimeout(() => {
      this.setTheme({value: this.currentTheme()});
      this.setLightDark(this.currentLightDark());
    },0);
    
  }

  setTheme = (ev) => {
    console.log(`setTheme(): ${ev.value}`);
    const themeClassEl: any = document.getElementsByTagName('body')[0]
    const oldTheme = themeClassEl.classList[0];
    if (oldTheme) {
      themeClassEl.classList.replace(oldTheme, this.currentTheme());
    } else {
      themeClassEl.classList.add(this.currentTheme());
    }
    localStorage.setItem('theme', this.currentTheme());
  }

  setLightDark = (mode) => {
    const appEl: any = document.getElementsByTagName('body')[0]
    appEl.classList.remove('lightTheme');
    appEl.classList.remove('darkTheme');
    appEl.classList.add(mode);
  }

  toggleLightDark = () => {
    const appEl: any = document.getElementsByTagName('body')[0]
    // const lightDark: any = themeClassEl.classList[1];
    console.log(`setLightDark() - ${this.currentLightDark()}`);

    if (appEl.classList.contains('lightTheme') || appEl.classList.contains('darkTheme')) {
      appEl.classList.remove('lightTheme');
      appEl.classList.remove('darkTheme');
      if (this.currentLightDark() == 'lightTheme') {
        this.currentLightDark.set('darkTheme');
        appEl.classList.add('darkTheme');
      } else {
        this.currentLightDark.set('lightTheme');
        appEl.classList.add('lightTheme');
      }
    } else {
      appEl.classList.add(this.currentLightDark());
    }
    localStorage.setItem('lightDark', this.currentLightDark());
  }
}

