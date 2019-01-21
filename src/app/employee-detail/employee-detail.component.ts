import { Component, OnInit, TemplateRef } from '@angular/core';
import { DashboardService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';

import * as CanvasJS from '../../../node_modules/canvasjs/dist/canvasjs.min';
import { NgxDateRangePickerOptions, NgxMenuItem } from 'ngx-daterangepicker';
import * as moment from 'moment';

import { LinechartService } from '../_services/linechart.service';
import { BarchartService } from '../_services/barchart.service';
import { CategoryService } from '../_services/category.service';
import { Global } from '../_global/global';
import { VBarChartService } from '../_services/v-bar-chart.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})

export class EmployeeDetailComponent implements OnInit {

  isLoading = true;

  fromDate;
  toDate;
  isCallHistoryLoading = false;
  isCallHistoryLoadmoreLoading = false;
  iscallHistoryEnd = false;


  isCallHistoryLoadingOne = false;
  isCallHistoryLoadmoreLoadingOne = false;
  iscallHistoryEndOne = false;



  isSocialLoading = false;
  isSocialLoadmoreLoading = false;
  isSocialEnd = false;

  // audio
  audioSrc = "";
  audioType = "";
  currentPlayingIndex = -1;
  currentPlayingIndexOfOne = -1;

  isPaused = false;
  isStopped = false;
  currentAudioTime = 0;

  playAudio: any;

  // employee
  employee;
  callHistoryList: any;
  socialHistoryList: any;

  nCurCall = 0;
  nCurCallOne = 0;

  nCurSocial = 0;


  // search variable
  callFromDate;
  callToDate;

  callFromDateOne;
  callToDateOne;

  curTitleDate;

  nCallFromDate = 0;
  nCallToDate = 0;

  callHistoryDateList = [];

  // return callers
  returnCallers = 1;

  // social search variable
  socialFromDate;
  socialToDate;
  nSocialFromDate;
  nSocialToDate;

  subType = 1;
  type = "topCallers";
  period = 1;
  special_period=14;


  // top blocks
  firstItem: any;
  secondItem: any;
  thirdItem: any;
  forthItem: any;
  ItemColors = Global._linechartcolors;

  // line chart variables
  lineChartData: any;
  curLineChartPeriod;

  // bar chart type
  barcharttype = 'day';
  categoryOfBarChart: any;
  
  hourlyChartData: any;
  dailyChartData: any;

  // top 3 summation boxes data
  totalIncoming;
  totalOutgoing;
  totalMissed;

  // period list for multi series chart
  periodList; any;
  dropdowns = [
    { id: "outCalls", label: "Outgoing Calls", unit: "" },
    { id: "incomingCalls", label: "Incoming Calls", unit: "" },
    { id: "missedCalls", label: "Missed Calls", unit: "" },
    { id: "missedCallPercent", label: "Missed Calls Percentage", unit: "%" },
    { id: "newCalls", label: "New Callers", unit: "" },
    { id: "newCallPercent", label: "New Callers Percentage", unit: "%" },
    { id: "incomingCallSum", label: "Incoming Call Duration", unit: "s" },
    { id: "outCallSum", label: "Outgoing Call Duration", unit: "s" },
    // {id: "newcall_number", label: "Number of new calls"},
    { id: "incomingCallAvg", label: "Average Incoming Call Duration", unit:"s" },
    { id: "outCallAvg", label: "Average Outgoing Call Duration", unit: "s" },
    { id: "callbackDelay", label: "Callback Delay", unit: "s" }
  ];

  options: NgxDateRangePickerOptions; // date range option
  dateRange;
  rangeOption: any;

  flagForLegentItemChange = false;

  contact_photo_root_path = "callmonitor.app/files/contact-photos/";

  // total summation
  totalSummation: any;

  public modalRef: BsModalRef;


  // callhistory for specific number show flag
  callhistory_showone = false;
  specific_number_of_callhistory;
  specific_contactname_of_callhistory;
  callLogsOfOne : any;

  constructor(private _dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private linechartservice: LinechartService,
    private barchartservice: BarchartService,
    private categoryService: CategoryService,
    private vbarchartservice: VBarChartService,
    private modalService: BsModalService
  ) {

  }

  ngOnInit() {

    // let todate = new Date();
    // todate.setUTCHours(23, 59, 59, 999);
    // this.nCallToDate = Math.round(todate.getTime());

    // for (let dd = this.nCallToDate; dd >= 0; dd = dd - 86400000) {
    //   this.callHistoryDateList.push(dd);
    // }
    this.isCallHistoryLoading = true;
    this.isCallHistoryLoadingOne = true;
    this.isSocialLoading = true;
    

    this._dashboardService.getEmployee().subscribe(res => {
      if (!res) {
        return false;
      }
     
      this.employee = res;

      this.initialize();
      this.setHeadItems();
      this.getCallHistory();
      this.getSocial();
      this.setLineChartCategories();
      this.getLineChartData();
      this.updateBarChart();
      this.updateVBarChart();
      this.getTotalSummation();
      return true;
    });
    // this.employee = JSON.parse(localStorage.getItem('cur_employee'));
    // if(!this.employee){
    //   this.router.navigate(["/"]);
    // }
    // let cur_employee_id = this.route.snapshot.queryParams['id'];
    let cur_employee_id = localStorage.getItem('cur_employee');
    this.employee = {id: cur_employee_id};
    this.setHeadItems();
    this.rangeOption = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'All Time': [moment(), moment()]
    };
    this._dashboardService.getEmployeeDetails({employeeId: cur_employee_id})
    .subscribe(res=>{
      if(res.success && res.data){
        

        this.employee = Object.assign(this.employee, res.data);
        this.employee.start_work_time  = Global.makeLocalTime(this.employee.start_work_time);
        this.employee.end_work_time = Global.makeLocalTime(this.employee.end_work_time);
      }
      this.initialize();
       
        this.getCallHistory();
        this.getSocial();
    
        this.setLineChartCategories();
        this.getLineChartData();
        this.updateBarChart();
        this.updateVBarChart();
        this.getTotalSummation();
    })

  }

  ngAfterViewInit() {

    this.playAudio = document.getElementById("playAudio");
    this.playAudio.onended = () => {
      this.currentPlayingIndex = -1;
      this.currentPlayingIndexOfOne = -1;
      if (this.audioSrc) {
        this.audioSrc = "";
      }
    }
  }

  initialize() {
    this.isLoading = true;

    this.fromDate = null;
    this.toDate = null;
    this.isCallHistoryLoading = false;
    this.isCallHistoryLoadmoreLoading = false;
    this.iscallHistoryEnd = false;

    this.isSocialLoading = false;
    this.isSocialLoadmoreLoading = false;
    this.isSocialEnd = false;

    // audio
    this.audioSrc = "";
    this.audioType = "";
    this.currentPlayingIndex = -1;
    this.isPaused = false;
    this.isStopped = false;
    this.currentAudioTime = 0;

    this.playAudio = document.getElementById("playAudio");

    // employee

    this.callHistoryList = null;
    this.socialHistoryList = null;

    this.nCurCall = 0;
    this.nCurSocial = 0;


    // search variable
    this.callFromDate = null;
    this.callToDate = null;

    // return callers
    this.returnCallers = 1;

    // social search variable
    this.socialFromDate = null;
    this.socialToDate = null;
    this.subType = 1;
    this.type = "topCallers";
    this.period = 1;

    // top blocks
    // this.firstItem = ;
    // this.secondItem = null;
    // this.thirdItem = null;
    // this.forthItem = null;

    // bar chart type
    this.barcharttype = 'day';

    this.periodList = [
      { label: "Hourly", period: 3600000, level: 0, enabled: false, checked: false },
      { label: "Daily", period: 86400000, level: 86400000, enabled: true, checked: false },
      { label: "Weekly", period: 604800000, level: 8640000000, enabled: true, checked: false },
      { label: "Monthly", period: 2592000000, level: 31536000000, enabled: true, checked: false },
    ];

    this.rangeOption = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'All Time': [moment(this.employee.mindate?this.employee.mindate:new Date()), moment(this.employee.maxdate?this.employee.maxdate:new Date())]
    };

    this.dateRange = {start: moment(this.employee.mindate?this.employee.mindate:new Date()), end: moment(this.employee.maxdate?this.employee.maxdate:new Date())};

    this.hourlyChartData = [];
    this.dailyChartData = [];

    this.totalIncoming = 0; 
    this.totalOutgoing = 0;
    this.totalMissed = 0;

    this.totalSummation = {
      incomingCalls: 0,
      outgoingCalls: 0,
      missedCalls: 0
    }

    this.socialFromDate = this.employee.mindate?new Date(this.employee.mindate):new Date();
    this.socialToDate = this.employee.maxdate?new Date(this.employee.maxdate):new Date();
    this.callFromDate = this.employee.mindate?new Date(this.employee.mindate):new Date();

    this.callToDate = this.employee.maxdate?new Date(this.employee.maxdate):new Date();
    this.callFromDateOne = this.employee.mindate?new Date(this.employee.mindate):new Date();
    this.callToDateOne = this.employee.maxdate?new Date(this.employee.maxdate):new Date();
  }

  setHeadItems() {

    this.firstItem = { "label": "Incoming Calls", id: "incomingCalls", "active": true,unit: "" };
    this.secondItem = { "label": "Outgoing Calls", id: "outCalls", "active": true, unit: "" };
    this.thirdItem = { "label": "Missed Calls", id: "missedCalls", "active": true, unit: "" };
    this.forthItem = { "label": "New callers", id: "newCalls", "active": true, unit: ""  };
    this.categoryOfBarChart = { "label": "Incoming Calls", id: "incomingCalls", "active": true,unit: ""}
  }

  getCallHistory() {
    let request = { "employeeId": this.employee.id, "fromdate": this.nCallFromDate, "todate": this.nCallToDate, limitFrom: this.nCurCall };
    if(!this.isCallHistoryLoadmoreLoading){
      this.isCallHistoryLoading = true;
    }
    console.log('first time in client for callhistory', new Date().getTime());
    this._dashboardService.getCallHistory(request).subscribe(res => {
      if (res.success) {
        
        if (res.data.length <10) {
          this.iscallHistoryEnd = true;
        }
        if (!this.callHistoryList) {
          this.callHistoryList = res.data;
        } else {
          this.callHistoryList = this.callHistoryList.concat(res.data);
        }
        this.nCurCall = this.callHistoryList.length;
        console.log('second time in client for callhistory', new Date().getTime());
      }
      this.isCallHistoryLoading = false;
      this.isCallHistoryLoadmoreLoading = false;
    })
  }

  setCurTitleDate = (date) => {
  }

  loadMoreCallHistory() {

    this.isCallHistoryLoadmoreLoading = true;
    this.getCallHistory();
  }

  onChangeCallHistoryDate() {
    // this.callFromDate =obj.value;
    this.callHistoryList = [];
    this.iscallHistoryEnd = false;
    this.isCallHistoryLoading = true;

    this.nCallFromDate = Math.round(new Date(this.callFromDate).getTime());
    this.nCallToDate = Math.round(new Date(this.callToDate).getTime());
    this.nCurCall = 0;
    this.getCallHistory();
  }


  playRecordedCall(name, index, flag) {
    this.callhistory_showone = flag;
    // let obj = document.getElementById('call-history-list').children[index];
    // $(window).scrollTop($(obj).offset().top);
    if (!name) {
      return false;
    }
    if (this.playAudio && this.currentPlayingIndex !== index) {
      this.isPaused = true;
      this.currentPlayingIndex = index;
      let rootPath = "https://callmonitor.app/files/recordings/";
      let fname = name;
      this.playAudio.currentTime = 0;
      this.currentAudioTime = 0;
      setInterval(()=>{
        this.currentAudioTime = this.playAudio.currentTime;
      }, 1000);
      this.audioSrc = rootPath + fname;
      try{
        this.playAudio.play();
      }catch{

      }
      
      this.isPaused = false;
     
      // for testing...
      // if(index%2===1){
      //   this.audioSrc = "https://callmonitor.app/files/recordings/4358db50-b70e-4b35-a304-a2f598df7982.wav";
      // }else{
      //   this.audioSrc = "http://localhost/mp3recordings/1b04c2b4-45f2-44a6-ab63-de86e09368f5.mp3";
      // }
      // ------ end testing---------
      //this.playAudio.play();
     // this.playAudio.type = audioType;
    }
    // else if (this.currentPlayingIndex === index) {
    //   if(!this.isPaused){
    //     this.playAudio.pause();
    //     this.isPaused = true;
    //     return;
    //   }else{
    //     this.playAudio.play();
    //     this.isPaused = false;
    //     return;
    //   }
    // }
  }

  playOrPauseAudio(){
    if(this.isPaused){
      this.playAudio.play();
      this.isPaused = false;
     
      return;
    }else{
      this.playAudio.pause();
      this.isPaused = true;
      return;
    }
  }

  // stop audio
  onStopAudio(){
    this.isPaused = true;
    this.playAudio.pause();
    this.playAudio.currentTime = 0;
  }

  closeAudioBoard(){
    this.currentPlayingIndex = -1;
  }

  setAudioCurTime(val){
    if(!this.isPaused){
      this.playAudio.pause();
      this.playAudio.currentTime = val;
      this.playAudio.play();
    }
  }

  // social part

  getSocial() {


    let request = {
      "employeeId": this.employee.id, type: this.type, subType: this.subType,special_period: this.special_period,
      "fromdate": this.nSocialFromDate, "todate": this.nSocialToDate, "limitFrom": this.nCurSocial, period: this.period
    };
    if(!this.isSocialLoadmoreLoading){
      this.isSocialLoading = true;
    }
    
    this._dashboardService.getSocial(request)
      .subscribe(res => {
        if (res.success) {
          if (res.data.length<10) {
            this.isSocialEnd = true;
          }
          if (!this.socialHistoryList) {
            this.socialHistoryList = res.data;
          } else {
            this.socialHistoryList = this.socialHistoryList.concat(res.data);
          }
          this.nCurSocial = this.socialHistoryList.length;

        }
        this.isSocialLoading = false;
        this.isSocialLoadmoreLoading = false;
      })
  }

  loadMoreSocial() {
    this.isSocialLoadmoreLoading = true;
    this.getSocial();
  }

  onChangeSocialDate() {
    this.nCurSocial = 0;
    this.isSocialEnd = false;
    this.socialHistoryList = [];
    this.isSocialLoading = true;
    this.nSocialFromDate = new Date(this.socialFromDate).getTime();
    this.nSocialToDate = new Date(this.socialToDate).getTime();
    this.getSocial();
  }

  onCallDateChange() {
    this.getCallHistory();
  }

  onSocialDateChange() {
    this.getSocial();
  }

  onSubTypeChange() {
    this.getSocial();
  }


  // date range change event handle

  onTriggerDateRange(event: any){
    event.preventDefault();

    let element: HTMLElement = document.getElementById('dateRangePicker') as HTMLElement;
    element.click();
  }


  onDateRangeChanged(){
    let startdateOfLine = Date.parse(new Date().toDateString());
    let enddateOfLine = startdateOfLine + 86399000;
    if (this.dateRange) {
      
      startdateOfLine = Date.parse(this.dateRange.start.format());
      enddateOfLine = Date.parse(this.dateRange.end.format());
    }
    this.setPeriodListEnabled(startdateOfLine, enddateOfLine);
    this.getLineChartData(); // main chart
    this.updateBarChart(); // daily chart
    this.updateVBarChart(); // hourly chart
  }

  
  setPeriodListEnabled(start, end) {
    let timestamp = end - start;
    console.log(timestamp);
    let index;
    // for(index = 0; index<this.periodList.length; index++){
    //   this.periodList[index].enabled = false;
    // }
    if(timestamp <= 86400000){
      this.periodList[0].enabled = true;
      this.curLineChartPeriod = this.periodList[0].period;
    }
    // else{
    //   // for(index = 1; index<this.periodList.length; index++) {
    //   //   if(timestamp>this.periodList[index].level){
    //   //     this.periodList[index].enabled = true;      
    //   //   }
    //   // }
    //   this.curLineChartPeriod = this.periodList[1].period;
    // }
    if(86400000<timestamp && timestamp<=8640000000){
      this.curLineChartPeriod = this.periodList[1].period;
    }
    if(8640000000<timestamp && timestamp<=31536000000){
      this.curLineChartPeriod = this.periodList[2].period;
    }
    if(timestamp>31536000000){
      this.curLineChartPeriod = this.periodList[3].period;
    }
  }

  // set current period 
  onSetCurPeriod(pObj){
    if(!pObj.enabled){
      return;
    }
    if(this.curLineChartPeriod === pObj.period){
      return;
    }
    this.curLineChartPeriod = pObj.period;
    this.getLineChartData();
  }

  /** Line char functions */
  setLineChartCategories() {
    let ids = [];
    let labels = [];
    let units = [];
    if(this.firstItem.active){
      ids.push(this.firstItem.id);
      labels.push(this.firstItem.label);
      units.push(this.firstItem.unit);
    }else{
      ids.push(undefined);
      labels.push("");
      units.push("");
    }
    if(this.secondItem.active){
      ids.push(this.secondItem.id);
      labels.push(this.secondItem.label);
      units.push(this.secondItem.unit);
    }else{
      ids.push(undefined);
      labels.push("");
      units.push("");
    }
    if(this.thirdItem.active){
      ids.push(this.thirdItem.id);
      labels.push(this.thirdItem.label);
      units.push(this.thirdItem.unit);
    }else{
      ids.push(undefined);
      labels.push("");
      units.push("");
    }
    if(this.forthItem.active){
      ids.push(this.forthItem.id);
      labels.push(this.forthItem.label);
      units.push(this.forthItem.unit);
    }else{
      ids.push(undefined);
      labels.push("");
      units.push("");
    }
    this.linechartservice.setCategory(
      ids, labels, units
    );
  }

  loadLineChart(){
    this.setLineChartCategories();
    if (this.lineChartData) {
      this.linechartservice.loadChart(this.lineChartData);
    }
  }

  getLineChartData() {
    let startdateOfLine = Date.parse(new Date().toDateString());
    let enddateOfLine = startdateOfLine + 86399000;
    if (this.dateRange) {
      startdateOfLine = Date.parse(this.dateRange.start.format());
      enddateOfLine = Date.parse(this.dateRange.end.format());
    }
    if(!this.curLineChartPeriod){
      this.setPeriodListEnabled(startdateOfLine, enddateOfLine);
    }

    let request = {
      start: startdateOfLine,
      end: enddateOfLine,
      empid: this.employee.id,
      period: this.curLineChartPeriod
    }

    this.linechartservice.updateChart(request).subscribe(data => {
      if (data.success) {
        this.lineChartData = data;

        // calculate total_callbackdelay 
        let total_callbackDelay = 0;
        
        total_callbackDelay = Global.getCallBackDelay(data.totalData.callbackDelay, this.employee.start_work_time, this.employee.end_work_time)/1000;
        
        this.lineChartData.totalData.callbackDelay = total_callbackDelay;
        this.firstItem.value = this.lineChartData.totalData[this.firstItem.id];
        this.secondItem.value = this.lineChartData.totalData[this.secondItem.id];
        this.thirdItem.value = this.lineChartData.totalData[this.thirdItem.id];
        this.forthItem.value = this.lineChartData.totalData[this.forthItem.id];

        // calculate each timeframe callbackdelay
        let chartDataCallBackDelay = [];
        let callbackDelayListOfChart = Global.getCallbackDelaySpanArray(this.lineChartData.chartData.callbackDelay, this.employee.start_work_time, this.employee.end_work_time);
        console.log("callbackDelayListOfChart ===================================", callbackDelayListOfChart);
        let dates = this.lineChartData.chartData.dates;
        for(let i = 0; i<dates.length - 1; i++){
            // chartDataCallBackDelay.push(Global.getCallBackDelay(callbackDelayListOfChart[i], this.employee.start_work_time, this.employee.end_work_time)/1000);
            chartDataCallBackDelay.push(Global.getCallBackDelayOfOneTimeSpan(callbackDelayListOfChart, dates[i], dates[i+1])/1000);
        }
        this.lineChartData.chartData.callbackDelay = chartDataCallBackDelay;

      }else{
        this.lineChartData = {totalData: [], chartData: []};
        this.firstItem.value ='';
        this.secondItem.value = '';
        this.thirdItem.value = '';
        this.forthItem.value = '';
      }
      this.linechartservice.loadChart(this.lineChartData);
      return;

    })
  }

  /** Line chart functions end */

  /** Legend Item functions */
  onLegendItemChange() {
    this.loadLineChart();
  }

  onLegendItemClick(item){
    
    this.flagForLegentItemChange = false;
    item.active =!item.active;
    this.loadLineChart();
  }

  onReturningCallChange() {
    this._dashboardService.getReturningCalls(this.returnCallers, this.employee.id);
  }

  formatLegendItemVal(val, unit){
      if(val===undefined || val===null){
        return '';
      }
      if(unit === 's'){
        return Global.getTimeStamp(val);
      }else{
        return Math.round(val*100)/100 + unit;
      }
  }

  /** Legend Item functions end */

  // bar chart
  updateBarChart() {
    let startdateOfBar = Date.parse(new Date().toDateString());
    let enddateOfBar = startdateOfBar + 86399000;
    if (this.dateRange) {
      startdateOfBar = Date.parse(this.dateRange.start.format());
      enddateOfBar = Date.parse(this.dateRange.end.format());
    }
    
    let request = {
      start: startdateOfBar,
      end: enddateOfBar,
      empid: this.employee.id
    }

    this.barchartservice.updateChartData(request).subscribe(res=>{
      this.dailyChartData = res;
      this.barchartservice.setCategory(this.categoryOfBarChart);
      let callBackDelaySpanArray = Global.getCallbackDelaySpanArray(res.callbackquery, this.employee.start_work_time, this.employee.end_work_time);
      for(let i = 0; i<res.chartDataOfDay.length; i++){
         this.dailyChartData.chartDataOfDay[i].callbackDelay = Global.getCallBackDelayOfDayInWeek(callBackDelaySpanArray, i)/1000;
      }
      
      this.barchartservice.setChartData(this.dailyChartData);
    });

  }



  /**
   *  hourly chart = vertical bar chart
   */
  // change category of data
  onChangeCategoryOfHourly(){

    // upate hourly chart
    this.vbarchartservice.setCategory(this.categoryOfBarChart);
    this.vbarchartservice.setChartData(this.hourlyChartData);

    // update daily chart
    this.barchartservice.setCategory(this.categoryOfBarChart);
    this.barchartservice.setChartData(this.dailyChartData);
  }
  

  // update hourly chart data
  updateVBarChart() {
    let startdateOfBar = Date.parse(new Date().toDateString());
    let enddateOfBar = startdateOfBar + 86399000;
    if (this.dateRange) {
      startdateOfBar = Date.parse(this.dateRange.start.format());
      enddateOfBar = Date.parse(this.dateRange.end.format());
    }
    
    let request = {
      start: startdateOfBar,
      end: enddateOfBar,
      empid: this.employee.id,
      timezonediff: (new Date()).getTimezoneOffset()
    }

    this.vbarchartservice.updateChartData(request).subscribe(res=>{
      this.hourlyChartData = res;
      
      this.vbarchartservice.setCategory(this.categoryOfBarChart);
      
      let fDate, lDate;
      // for(let i = 0; i<res.chartDataOfHourly.length; i++){
      //   fDate = i>9?i+":00":"0"+i+":00";
      //   lDate = (i+1)>9?(i+1)+":00":"0"+(i+1)+":00";
      //   // this.hourlyChartData.chartDataOfHourly[i].callbackDelay = Global.getCallBackDelay(res.chartDataOfHourly[i].callbackDelay, fDate, lDate)/1000;
      // }
      let callBackDelaySpanArray = Global.getCallbackDelaySpanArray(res.callbackquery, this.employee.start_work_time, this.employee.end_work_time);
      console.log("========= Callbackdelayspanarray ===== hourly chart ==============", callBackDelaySpanArray);
      for(let i = 0; i<res.chartDataOfHourly.length; i++){
        this.hourlyChartData.chartDataOfHourly[i].callbackDelay = Global.getCallBackDelayOfHourly(callBackDelaySpanArray, i) / 1000;
      }
      this.vbarchartservice.setChartData(this.hourlyChartData);
    });

  }

  public getIncomvsOutgoing(incom, outgoing){
    if(outgoing == 0){
      outgoing = 1;
    }
    return Math.round(Math.round(incom)/Math.round(outgoing)*10)/10;
  }

  // total summation data
  getTotalSummation(){
    this._dashboardService.getTotalSummation(this.employee.id)
    .subscribe(res=>{
        this.totalSummation = res;
    })
  }

  // get callhistory of specific number
  getCallHistoryOfNumber(number, contactname, template: TemplateRef<any>){
    this.specific_number_of_callhistory = number;
    this.specific_contactname_of_callhistory = contactname;
    
    this.callhistory_showone = true;
    
    this.isCallHistoryLoadingOne = true;
    this.iscallHistoryEndOne = false;
    this.isCallHistoryLoadmoreLoadingOne = true;
    this.callLogsOfOne = [];
    this.nCurCallOne = 0;

    this.callFromDateOne = new Date(this.employee.mindate);
    this.callToDateOne = new Date(this.employee.maxdate);
    this.modalRef = this.modalService.show(template);

    this.getCallHistoryOfOne(number);
  }

  getCallHistoryOfOne(number){
    let fromDate = this.callFromDateOne?Math.floor(new Date(this.callFromDateOne).getTime()):undefined;
    let toDate = this.callToDateOne?Math.floor(new Date(this.callToDateOne).getTime()):undefined;
    let request = { "employeeId": this.employee.id, "fromdate": fromDate, "todate": toDate, limitFrom: this.nCurCallOne, number: number};
      this._dashboardService.getCallHistoryOfNumber(request).subscribe(res=>{
        if (res.success) {
          if (res.result.length <10) {
            this.iscallHistoryEndOne = true;
          }
          if (!this.callLogsOfOne) {
            this.callLogsOfOne = res.result;
          } else {
            this.callLogsOfOne = this.callLogsOfOne.concat(res.result);
          }
          this.nCurCallOne = this.callLogsOfOne.length;
        }
        this.isCallHistoryLoadingOne = false;
        this.isCallHistoryLoadmoreLoadingOne = false;
      })
      
 }

 onChangeCallHistoryDateOne() {
  // this.callFromDate =obj.value;
  this.callLogsOfOne = [];
  this.iscallHistoryEndOne = false;
  this.isCallHistoryLoadingOne = true;

  this.nCurCallOne = 0;
  this.getCallHistoryOfOne(this.specific_number_of_callhistory);
}

  // get callhistory of specific contact
  getCallHistoryOfContact(number, name){
    
  }

  loadMoreCallHistoryOfOne(){
    this.isCallHistoryLoadmoreLoadingOne = true;
    this.getCallHistoryOfOne(this.specific_number_of_callhistory);
  }

  // get photo path
  
}
