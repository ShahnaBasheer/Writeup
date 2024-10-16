import { Component, EventEmitter, Output } from '@angular/core';



@Component({
  selector: 'app-delete-alert',
  standalone: true,
  imports: [],
  templateUrl: './delete-alert.component.html',
  styleUrl: './delete-alert.component.css'
})
export class DeleteAlertComponent {
  @Output() alertResponse = new EventEmitter<boolean>(false);

  constructor() {}

  close() {
    this.alertResponse.emit(false);
  }

  confirm() {
    this.alertResponse.emit(true); // pass 'true' when confirming
  }
}
