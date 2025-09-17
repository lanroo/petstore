import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PetListComponent } from './pet-list.component';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PetListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatChipsModule,
        MatExpansionModule,
        MatTooltipModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have component properties', () => {
    expect(component.pets).toBeDefined();
    expect(component.loading).toBeDefined();
    expect(component.searchTerm).toBeDefined();
  });
});