import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotfoundPage } from './notfound.page';

describe('NotfoudPage', () => {
  let component: NotfoundPage;
  let fixture: ComponentFixture<NotfoundPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotfoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
