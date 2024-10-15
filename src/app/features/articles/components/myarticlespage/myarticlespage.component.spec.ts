import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyarticlespageComponent } from './myarticlespage.component';

describe('MyarticlespageComponent', () => {
  let component: MyarticlespageComponent;
  let fixture: ComponentFixture<MyarticlespageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyarticlespageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyarticlespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
