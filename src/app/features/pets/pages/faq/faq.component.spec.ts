import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FaqComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatExpansionModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatTooltipModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hero section', () => {
    const heroElement = fixture.nativeElement.querySelector('.hero-section');
    expect(heroElement).toBeTruthy();
  });

  it('should have FAQ section', () => {
    const faqElement = fixture.nativeElement.querySelector('.faq-section');
    expect(faqElement).toBeTruthy();
  });

  it('should have contact section', () => {
    const contactElement = fixture.nativeElement.querySelector('.contact-section');
    expect(contactElement).toBeTruthy();
  });
});
