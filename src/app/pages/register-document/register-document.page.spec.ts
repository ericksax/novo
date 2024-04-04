import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterDocumentPage } from './register-document.page';

describe('RegisterDocumentPage', () => {
  let component: RegisterDocumentPage;
  let fixture: ComponentFixture<RegisterDocumentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterDocumentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
