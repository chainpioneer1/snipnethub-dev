import { Component, OnInit, TemplateRef, Input} from '@angular/core';
import { DashboardService, AlertService } from '../_services';
import { Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Global } from '../_global/global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PasswordValidation } from '../_services/validate.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Loading............
  public modalRef: BsModalRef;
  workTimeForm: FormGroup;
  changeNameForm: FormGroup;
  changePwdForm: FormGroup;
  submitted = false;
  nameSubmitted = false;
  pwdSubmitted = false;

  selectedEmp: any;
  detailedEmployeeList = [];
  isLoading = true;
  currentUser;
  fromDate;
  toDate;

  constructor(private _dashboardService: DashboardService, 
    private alertService: AlertService,
    private modalService: BsModalService,
    private router: Router,
    private formBuilder: FormBuilder) {

     }

  ngOnInit() {
   
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let today = new Date();
    this.toDate = new Date();
    this.fromDate = new Date(today.setMonth(today.getMonth() - 1));
    this.workTimeForm = this.formBuilder.group({
      startWorkTime: [null, Validators.compose([Validators.required])],
      endWorkTime: [null, Validators.compose([Validators.required])],
      empId: [null]
    });

    this.changeNameForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      empId: [null]
    });
    this.changePwdForm = this.formBuilder.group({
      password: [null, Validators.compose([Validators.required])],
      confirm_password: [null, Validators.compose([Validators.required])],
      empId: [null]
    });
    this.getEmployeeList();

  }

  getEmployeeList(){
      this.isLoading = true;
      this._dashboardService.getEmployeeList(this.currentUser.id).subscribe(async res=>{
        if(res.success){
          
          this.detailedEmployeeList = res.data;
          if(this.detailedEmployeeList.length > 0){
              await this.detailedEmployeeList.forEach(async (element, index)=>{
                  await this.getEmployeeDetails(element);
              });
          }
          this.isLoading = false;
        }else{
          this.isLoading = false;
        }
      })
  }

// get employee detail
getEmployeeDetails(emp){
    let empid = emp.id;
    var request = {employeeId: empid, fromDate: this.fromDate, toDate: this.toDate};
    

    this._dashboardService.getEmployeeDetails(request).subscribe(res=>{
      if(res.success && res.data){
        var index = this.detailedEmployeeList.findIndex((emp)=>{
          return emp.id === empid;
        });
        if(index > -1){
          // if(res.data.incomingCalls.count + res.data.outcalls.count+res.data.missedCalls.count){
          //   res.data.missedCalls.percent = res.data.missedCalls.count/(res.data.incomingCalls.count + res.data.outcalls.count+res.data.missedCalls.count)*100;
          // }
          this.detailedEmployeeList[index] = Object.assign(this.detailedEmployeeList[index], res.data);
          this.detailedEmployeeList[index].start_work_time = emp.start_work_time=="00:00:00"?"06:00":Global.makeLocalTime(emp.start_work_time);
          this.detailedEmployeeList[index].end_work_time = emp.end_work_time=="00:00:00"?"18:00":Global.makeLocalTime(emp.end_work_time);
          
          this.detailedEmployeeList[index].callbackdelay = Global.getCallBackDelay(res.data.callbackquery, this.detailedEmployeeList[index].start_work_time, this.detailedEmployeeList[index].end_work_time)/1000;
        }
        
      }
    })
}

// search
onDateChange = async()=>{
  this.getEmployeeList();
  // this.isLoading = true;
  // await(this.detailedEmployeeList.forEach(async(element, index)=>{
  //   await this.getEmployeeDetails(element.id);
  // }));
  // this.isLoading = false;
}

onDeactive(id){
  this._dashboardService.deactive(id)
  .subscribe(res=>{
    if(res.success){
      location.reload();
    }
  })
}

// delete employee
onDelete(id){
  if(confirm("Are you sure to delete this employee")){
    this._dashboardService.delete(id)
    .subscribe(res=>{
      if(res.success){
       location.reload();
      }
    })
  }
  
}

// go to detail page
goToDetail(emp){
  if(emp.disabled === 1){
    return;
  }
  // localStorage.removeItem('cur_employee');
  localStorage.setItem('cur_employee', emp.id);
  this.router.navigate(['employee-detail']);
}

// show working time set dialog
showWorkTimeSettingDlg(template: TemplateRef<any>, emp){
  this.selectedEmp = emp;
  this.modalRef =  this.modalService.show(template);
}

onSubmit(formVal: any){
  console.log('worktime --------------', formVal);
  if(formVal.startWorkTime ==""){
    formVal.startWorkTime = this.selectedEmp.start_work_time;
  }
  if(formVal.endWorkTime == ""){
    formVal.endWorkTime = this.selectedEmp.end_work_time;
  }
  this.submitted = true;

  formVal.empId = this.selectedEmp.id;
    if(this.workTimeForm.invalid){
      return;
    }
   
    let start = Global.makeUtcTime(formVal.startWorkTime);
    formVal.startWorkTime = start;

    let end = Global.makeUtcTime(formVal.endWorkTime);
    formVal.endWorkTime = end;

    this._dashboardService.updateWorkTime(formVal).subscribe(
      data=>{
        if(data.success){
            this.alertService.success("Updated Successfully!");
            let parent = this;
            setTimeout(() => {
                location.reload();
            }, 1000);
        }else{
          this.alertService.error(data.message);
        }
      }
    )
}

get changeNameF(){
  return this.changeNameForm.controls;
}

get changePwdF(){
  return this.changePwdForm.controls;
}

onRename(templateRenameDlg: TemplateRef<any>, emp){
  this.selectedEmp = emp;
  this.modalRef =  this.modalService.show(templateRenameDlg);
}

onChangePwd(templatePwdDlg: TemplateRef<any>, emp){
  this.selectedEmp = emp;
  this.modalRef =  this.modalService.show(templatePwdDlg);
}

onChangeRecording(emp){
  let param = {
    empId: emp.id,
    recording: !emp.recording_enabled
  };
  this._dashboardService.changeEnableState(param)
  .subscribe(res=>{
    if(res.success){
      emp.recording_enabled = !emp.recording_enabled;
    }
  });
}

submitChangeName(formVal: any){
  
  this.nameSubmitted = true;
  formVal.empId = this.selectedEmp.id;
  if(this.changeNameForm.invalid){
    
    return;
  }
  this._dashboardService.updateName(formVal)
  .subscribe(res=>{
    if(res.success){
      this.alertService.success("Updated Successfully!");
      this.selectedEmp.name = formVal.name;
    }else{
      this.alertService.error(res.msg);
    }
  })
}

submitChangePwd(){
  let formVal = this.changePwdForm.value;
  this.pwdSubmitted = true;
  let password = formVal.password;
  let confirm_password = formVal.confirm_password;
  if(password !== confirm_password){
    
    this.alertService.error("Password not match");
    return;
  }
  formVal.empId = this.selectedEmp.id;
  if(this.changePwdForm.invalid){
    
    return;
  }
  this._dashboardService.updatePassword(formVal)
  .subscribe(res=>{
    if(res.success){
      this.alertService.success("Updated Successfully!");
    }else{
      this.alertService.error(res.msg);
    }
  })
}

}
