import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../_models/index';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private subject = new Subject<any>();

  constructor(private http: HttpClient) { }

  getEmployeeList(id) {
    return this.http.get<any>(Config.API_URL + 'api/getEmployeeList?id=' + id);
  }

  getEmployeeDetails(request) {
    return this.http.post<any>(Config.API_URL + "api/getEmployeeDetails", request);
  }

  getEmployeeDetailsByName(request){
    return this.http.post<any>(Config.API_URL + "api/getEmployeeDetailsByName", request);
  }

  deactive(id) {
    return this.http.get<any>(Config.API_URL + "api/deactiveEmployee?id=" + id);
  }

  delete(id) {
    return this.http.get<any>(Config.API_URL + 'api/deleteEmployee?id=' + id);
  }

  getCallHistory(request) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(request);
    return this.http.post<any>(Config.API_URL + "api/getCallhistory", body, { headers });
  }

  getSocial(request) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(request);
    return this.http.post<any>(Config.API_URL + "api/getsocial", body, { headers });
  }

  getReturningCalls(period, empId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify({period: period, empId: empId});
    return this.http.post<any>(Config.API_URL + "api/getReturningCalls", body, {headers});
  }

  onSearch(emp){
    let request = {name: emp.name};
    this.getEmployeeDetailsByName(request).subscribe(res=>{
      if(res.success){
        emp = Object.assign(emp, res.data);
        this.subject.next(emp);
      }
    })
  }


  // get total summation data
  getTotalSummation(empId){
    return this.http.get<any>(Config.API_URL + 'api/getTotalSummation?empId='+empId);
  }

  getEmployee(): Observable<any>{
    return this.subject.asObservable();
  }

  getUserList(employerid){
    return this.http.get<any>(Config.API_URL + "api/getEmpList?id=" + employerid);
  }



  // Super admin services
  getEmployerList(){
    return this.http.get<any>(Config.API_URL + 'api/getEmployerList');
  }

  // add seat

  addSeat(id){
    return this.http.get<any>(Config.API_URL + 'api/addSeat?empId='+id);
  }

  // remove seat
  delSeat(id){
    return this.http.get<any>(Config.API_URL + 'api/delSeat?empId='+id);
  }

  // deactive 
  deactivate(id){
    return this.http.get<any>(Config.API_URL + 'api/deactivate?empId='+id);
  }

  //updateWorkTime
  updateWorkTime(formVal){
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(formVal);
    return this.http.post<any>(Config.API_URL + "api/updateWorkTime", body, { headers });
  }

  // get call history of number
  getCallHistoryOfNumber(request){
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(request);
    return this.http.post<any>(Config.API_URL + 'api/getCallHistoryOfNumber', body, {headers});
  }

  // get call history of contact
  getCallHistoryOfContact(empId, number, name){
    return this.http.get<any>(Config.API_URL + 'api/getCallHistoryOfContact?empId='+empId + "&number=" +  number);
  }

  // checkPhoto
  checkPhoto(photoUrl){
    return this.http.get<any>(photoUrl);
  }


  // change name
  updateName(formVal){
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(formVal);
    return this.http.post<any>(Config.API_URL + "api/changeEmployeeName", body, {headers});
  }

  // change password
  updatePassword(formVal){
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(formVal);
    return this.http.post<any>(Config.API_URL + "api/changeEmployeePwd", body, {headers});
  }

  // change recording state
  changeEnableState(formVal){
    let headers = new HttpHeaders();
    headers = headers.append('Content-type', 'application/json');
    let body = JSON.stringify(formVal);
    return this.http.post<any>(Config.API_URL + "api/changeEnableState", body, {headers});
  }
}
