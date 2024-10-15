import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedTopicsComponent } from './interested-topics.component';

describe('InterestedTopicsComponent', () => {
  let component: InterestedTopicsComponent;
  let fixture: ComponentFixture<InterestedTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestedTopicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
