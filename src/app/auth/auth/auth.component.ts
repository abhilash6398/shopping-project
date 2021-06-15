import { ViewContainerRef, OnDestroy} from '@angular/core';
import { PlaceholderDirective } from './../../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../../shared/alert/alert.component';
import { Router } from '@angular/router';
import { AuthResponseData, AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {

  isLoginMode = true;
  isLoading= false;
  error: string =null;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email=form.value.email;
    const password= form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading=true;
    if(this.isLoginMode){
      authObs = this.authService.login(email,password)
    } else {
      authObs = this.authService.signup(email,password)
    }

    authObs.subscribe(
      resdata => {
        console.log(resdata);
        this.isLoading=false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error=errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading=false;
      }
    );
    form.reset();
  }

  onHandleError(){
    this.error=null;
  }

  ngOnDestroy() {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string){
    // const alerCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

}
