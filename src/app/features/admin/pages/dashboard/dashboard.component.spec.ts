import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatChipsModule,
        MatTooltipModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        MatDividerModule,
        MatStepperModule,
        MatDialogModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have dashboard header', () => {
    const headerElement = fixture.nativeElement.querySelector('.dashboard-header');
    expect(headerElement).toBeTruthy();
  });

  it('should have main content area', () => {
    const mainElement = fixture.nativeElement.querySelector('.dashboard-main');
    expect(mainElement).toBeTruthy();
  });
});