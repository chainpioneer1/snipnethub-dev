import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';

import { AlertService, AuthenticationService } from '../_services';
import { Config } from '../_models';
import { Global } from '../_global/global';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  loading = false;
    
    loginForm : FormGroup;
    submitted =  false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
       
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        })
    }

    get f() {return this.loginForm.controls;}

    login(formVal: any) {
        this.submitted = true;
        
        if(this.loginForm.invalid){
            return; 
        }
        let protocol = location.protocol;
        let slashes = protocol.concat("//");
        let port = "";
        if(location.port!==""){
           port = ":"+location.port;
        }
        let returnUrl = slashes.concat(location.hostname).concat(port).concat("/reset-password");

        formVal.returnUrl = returnUrl;
        this.loading = true;
        this.authenticationService.sendVerifyRequest(formVal)
            .subscribe(
                data => {
                    if(data.success === true){
                        this.alertService.success("Please check your mail box to confirm your request.");
                        this.loading = false;
                    }else{
                        this.alertService.error(data.message);
                        this.loading = false;
                    }
                },
                error => {
                    this.alertService.error("Server is not running. Please check status of server.");
                    this.loading = false;
                });
    }

}
