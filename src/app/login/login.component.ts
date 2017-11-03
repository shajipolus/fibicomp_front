import { Component, Output, Input, AfterViewInit, ViewChild,ViewChildren, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.component.service';
import { DashboardService } from '../dashboard/dashboard.component.service';
import { SessionmanagementService } from "../session/session.management.service";

@Component({
    selector: 'login-tpl',
    templateUrl: 'login.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css'],
    providers: [SessionmanagementService],
    outputs: ['fullName']
})

export class LoginComponent implements AfterViewInit{
    credentials = {
        username: '',
        password: ''
    };
    fullName: string;
    errorMsg: string;
    isAuthenticated: string;
    loginFail: boolean = false;
    result: any = {};
    personDTO: any[];
    isAdmin : boolean = false;
    personId : string;
    firstName: string;
    lastName: string;
    
    constructor( private loginService: LoginService, private router : Router, private dashboardService:DashboardService, private sessionService : SessionmanagementService, private renderer: Renderer ){
        if (!this.sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
          } else {
            this.router.navigate( ['/dashboard']);
          }
    }
    
    @ViewChildren('input') usernameInput;
     ngAfterViewInit() {
         this.usernameInput.first.nativeElement.focus();
     } 
  
    @ViewChild('input') input: ElementRef;
    login(){
         this.loginService.login( this.credentials.username , this.credentials.password ).subscribe(
             data => {
                        this.result = data || [];
                        if (this.result.login == true) {
                        this.fullName = this.result.fullName;
                        this.personId = this.result.personID;
                        this.isAdmin = this.result.unitAdmin;
                        this.firstName = this.result.firstName;
                        this.lastName = this.result.lastName;
                        localStorage.setItem( 'currentUser' , this.result.userName);
                        localStorage.setItem( 'personId' , this.personId);
                        localStorage.setItem( 'userFullname' , this.result.fullName);
                        localStorage.setItem( 'firstName' , this.result.firstName);
                        localStorage.setItem( 'lastName' , this.result.lastName);
                        localStorage.setItem( 'isAdmin' , String(this.isAdmin));
                        this.router.navigate( ['/dashboard'] );  debugger;
                        } else {
                            this.loginFail = true;
                            this.credentials.username = '';
                            this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
                        }
                    },
             error => { 
                        console.log(error); 
                    },
        );      
    } 
}