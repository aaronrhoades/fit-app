import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCreateEditComponent } from './asset-create-edit.component';

describe('AssetCreateEditComponent', () => {
  let component: AssetCreateEditComponent;
  let fixture: ComponentFixture<AssetCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCreateEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetCreateEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
