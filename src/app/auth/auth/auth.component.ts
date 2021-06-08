import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoginMode = true;

  constructor(private authService: AuthService){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email=form.value.email;
    const password= form.value.password;
    if(this.isLoginMode){
      //..
    } else {
      this.authService.signup(email,password).subscribe(resdata=>{
        console.log(resdata);
      },error=>{
        console.log(error);
      });
    }
    form.reset();
  }
}
