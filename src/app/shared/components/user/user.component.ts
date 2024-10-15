import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [ RouterModule, FooterComponent, CommonModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
    menues = [
        { name: "Dashboard", icon:"fas fa-home", path: "/dashboard" },
        { name: "Profile", icon:"fas fa-user", path: "/profile" },
        { name: "My Articles", icon:"fa-solid fa-newspaper", path: "/myarticles" },
        { name: "Create", icon:"fa-solid fa-circle-plus", path: "/create" },
        { name: "Logout", icon:"fas fa-sign-out-alt", path: "" },
     ]
}
