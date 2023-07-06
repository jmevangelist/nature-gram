import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { applicationIcon } from '@cds/core/icon';

describe('AppComponent', () => {
  let component:AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HomeComponent,
        RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  })

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'natureGram'`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('natureGram');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('natureGram');
  });

});