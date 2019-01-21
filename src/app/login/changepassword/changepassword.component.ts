import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AlertService } from '../../_services';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
 loading = false;

  mainForm: FormGroup;
  submitted = false;
  currentUser;
  token;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.mainForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

    this.token = this.route.snapshot.queryParams['token'];
  }

  get f(){
    return this.mainForm.controls;
  }

  login(formVal: any) {
        this.submitted = true;
        
        if(this.mainForm.invalid){
            return; 
        }

        if(formVal.new_password!==formVal.confirm_password){
          this.alertService.error("New Password is mismatch.");
          return;
        }

        formVal.token = this.token;
        this.loading = true;
        this.authenticationService.resetPassword(formVal)
            .subscribe(
                data => {
                    if(data.success === true){
                        this.alertService.success("Password is reset successfully.");
                        this.loading = false;
                        let parent = this;
                        localStorage.setItem("currentUser", JSON.stringify(data.user));
                        localStorage.setItem("isAdmin", data.isAdmin);
                        setTimeout(() => {
                            if(data.isAdmin){
                              parent.router.navigate(['/super-admin']);
                            }else{
                              parent.router.navigate(['']);
                            }
                        }, 2000);
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

  onCancel(){
    history.back();
  }

}
