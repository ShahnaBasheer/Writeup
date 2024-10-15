import { Component } from '@angular/core';
import { MyarticleComponent } from '../../../../shared/components/myarticle/myarticle.component';

@Component({
  selector: 'app-myarticlespage',
  standalone: true,
  imports: [ MyarticleComponent ],
  templateUrl: './myarticlespage.component.html',
  styleUrl: './myarticlespage.component.css'
})
export class MyarticlespageComponent {

}
