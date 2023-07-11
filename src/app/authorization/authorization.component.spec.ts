import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthorizationComponent } from './authorization.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthorizationService } from './authorization.service';
import { ClrLoadingState } from '@clr/angular';
import { User } from '../inaturalist/inaturalist.interface';

let authService:  Partial<AuthorizationService>;
let authServiceStub: Partial<AuthorizationService>;
let me: User;

authServiceStub = {
  token: 'token',
  me: { id: 123, login: 'USER' },
  // updateTaxa: ()=>{},
  logout: ()=>{ }
}

describe ('AuthorizationComponent', ()=>{
  let component:AuthorizationComponent;
  let fixture:ComponentFixture<AuthorizationComponent>;

  beforeEach(async()=>{
    await TestBed.configureTestingModule({
      imports: [
        AuthorizationComponent
      ],
      providers: [provideAnimations(),
        {provide: AuthorizationService, useValue: authServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthorizationService)
    
  })

  it('should create the component',()=>{
    expect(component).toBeTruthy();
  })

  it('should have an authService',()=>{
    expect(component.authService).toBeTruthy()
  })

  it('should create a Form',()=>{
   expect(component.authForm).toBeTruthy() 
  })

  it('should greet #me',()=>{
    fixture.detectChanges();
    let textGreeting = fixture.nativeElement.querySelector('.greeting').textContent
    expect(textGreeting).withContext('"Hello..."').toContain("Hello");
    expect(textGreeting).withContext('expected name').toContain('USER');
  })

  it('should load token from service into the form',()=>{
    expect(component.authForm.value.token).toEqual(authServiceStub.token)
  })

  it('should load me from service into #me',()=>{
    expect(component.me).toEqual(authServiceStub.me)
  })

  it('#auth should set #me to undefined and reset #authForm',()=>{
    component.authForm.setValue({'token':'new token'})
    component.auth();
    expect(component.me).toBeUndefined();
    expect(component.authForm.pristine).toBeTrue()
  })

})