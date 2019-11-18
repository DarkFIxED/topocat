import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedLayoutComponent } from './unauthorized-layout.component';

describe('UnauthorizedLayoutComponent', () => {
  let component: UnauthorizedLayoutComponent;
  let fixture: ComponentFixture<UnauthorizedLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorizedLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
