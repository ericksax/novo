import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FretesPage } from './fretes.page';

describe('FretesPage', () => {
  let component: FretesPage;
  let fixture: ComponentFixture<FretesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FretesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
