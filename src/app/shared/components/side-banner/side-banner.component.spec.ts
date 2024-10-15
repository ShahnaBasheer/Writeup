import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBannerComponent } from './side-banner.component';

describe('SideBannerComponent', () => {
  let component: SideBannerComponent;
  let fixture: ComponentFixture<SideBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
