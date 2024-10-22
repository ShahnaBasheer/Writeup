import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [RouterModule, FooterComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  menues = [
    { name: 'Dashboard', icon: 'fas fa-home', path: '/dashboard' },
    { name: 'Profile', icon: 'fas fa-user', path: '/profile' },
    { name: 'My Articles', icon: 'fa-solid fa-newspaper', path: '/myarticles' },
    { name: 'Create', icon: 'fa-solid fa-circle-plus', path: '/create' },
    { name: 'Logout', icon: 'fas fa-sign-out-alt', path: '/logout' },
  ];
  isSidebarOpen: boolean = false;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onMenuClick(menu: { name: string, icon: string, path: string },) {
    if (menu.path === '/logout') {
      this.authservice.logout().subscribe({
        next: (res) => {
          this.toastr.success(res?.message);
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (err) => {
          this.toastr.error(
            err.error?.message ?? 'Something went wrong. Please Try Later!'
          );
        },
      });
    } else {
      this.router.navigate([menu.path]); // Navigate to the selected path
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
