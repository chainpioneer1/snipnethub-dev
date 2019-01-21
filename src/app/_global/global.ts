export class Global {
    static sleep = function (delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    static getCurrentUser = function () {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static _linechartcolors = ['#00AC5C', '#F5B723', '#E5003F', '#4c8efc'];

    static getTimeStamp = function (timestamp) {
        let hour = Math.floor(timestamp / 3600);
        let hhour = hour === 0 ? "00" : (hour > 0 && hour < 10) ? "0" + hour : hour;
        let min = Math.floor((timestamp % 3600) / 60);
        let mmin = min === 0 ? "00" : (min > 0 && min < 10) ? "0" + min : min;
        let sec = (Math.round(timestamp) % 3600) % 60;
        let ssec = sec === 0 ? "00" : (sec > 0 && sec < 10) ? "0" + sec : sec;
        return "" + hhour + ":" + mmin + ":" + ssec;
    }


    static formatAMPM_HOUR = function(timestamp){
        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        var strTime = (hours>=10?hours:("0"+hours)) + ' ' + ampm;
        return strTime;
    }
    
    static formatDate = function(timestamp){
        let date = new Date(timestamp).toString();
        let datestrings = date.split(' ');
        return datestrings[1] + " "+datestrings[2]+", "+datestrings[3];        
    }

    static getMMSS = function(timestamp){
        if(timestamp==0){
            return "00:00";
        }
        let min = Math.floor(timestamp / 60);
        let mmin = min === 0 ? "00" : (min > 0 && min < 10) ? "0" + min : min;
        let sec = (Math.round(timestamp) % 3600) % 60;
        let ssec = sec === 0 ? "00" : (sec > 0 && sec < 10) ? "0" + sec : sec;
        return "" + mmin + ":" + ssec;
    }

    static getTimeOffset = function(date){
        date = new Date(date);
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        return hours*3600 + mins * 60 + secs;
    }

    static max = function(a, b){
        return a>=b?a:b;
    }

    static min = function(a, b){
        return a<b?a:b;
    }

    static getCallBackDelay = function(callbackquery, start_work_time, end_work_time){
        
        let callbackdelay = 0;
        let today = new Date().toDateString();
        let start = new Date(today+" "+start_work_time);
        let end = new Date(today + " " + end_work_time);
        let start_time = this.getTimeOffset(start);
        start_time = start_time>0?start_time:32400;
        let end_time = this.getTimeOffset(end);
        end_time = end_time>0?end_time:75600;

        let curMissedTime = 0;
        let curMissedDate = '';
        let curMissedTimeOffset = 0;

        
        let curItemDate = '';
        let curItemTimeOffset = 0;
        for(let i = 0; i<callbackquery.length; i++){
           
            curItemDate = new Date(callbackquery[i].date).toDateString();
            curItemTimeOffset = this.getTimeOffset(callbackquery[i].date);
            if(callbackquery[i].type === 3){
                if(curMissedTime === 0){
                    if(curItemTimeOffset <=end_time){
                        curMissedTime = callbackquery[i].date;
                    }
                    continue;
                }else{
                    curMissedDate = new Date(curMissedTime).toDateString();
                    
                    curMissedTimeOffset = this.getTimeOffset(curMissedTime);
                    if(curMissedDate == curItemDate){
                        if(curItemTimeOffset <= end_time){
                            continue;
                        }else{
                            callbackdelay += (end_time - curMissedTimeOffset)*1000;
                            curMissedTime = 0;
                        }
                        continue;
                    }else{
                        callbackdelay += (end_time - this.max(start_time, curMissedTimeOffset))*1000;
                        if(curItemTimeOffset<=end_time){
                            curMissedTime = callbackquery[i].date;
                        }else{
                            curMissedTime = 0;
                        }
                        continue;
                    }
                }
            }else{
                if(curMissedTime === 0){    
                    continue;
                }else{
                    curMissedDate = new Date(curMissedTime).toDateString();
                    curItemDate = new Date(callbackquery[i].date).toDateString();
                    curMissedTimeOffset = this.getTimeOffset(curMissedTime);

                    if(curMissedDate == curItemDate){
                        curItemTimeOffset = this.getTimeOffset(callbackquery[i].date);
                        if(curItemTimeOffset >= start_time){
                            callbackdelay += (this.min(end_time, curItemTimeOffset) - this.max(start_time, curMissedTimeOffset))*1000;    
                        }
                        curMissedTime = 0;
                        continue;
                    }else{
                        callbackdelay += (end_time - this.max(start_time, curMissedTimeOffset))*1000;
                        curMissedTime = 0;
                        continue;
                    }

                }
            }
        }
        if(curMissedTime!==0){
            curMissedTimeOffset = this.getTimeOffset(curMissedTime);
            callbackdelay +=(end_time - this.max(start_time, curMissedTimeOffset)) * 1000;
        }

        return callbackdelay;
        
    }

    /** Get call back delay timespan array */
    static getCallbackDelaySpanArray = function(callbackquery, start_work_time, end_work_time){
        let callbackdelay = [];
        let callbackdelaySpan = 0;
        let today = new Date().toDateString();
        let start = new Date(today+" "+start_work_time);
        let end = new Date(today + " " + end_work_time);
        let start_time = this.getTimeOffset(start);
        start_time = start_time>0?start_time:32400;
        let end_time = this.getTimeOffset(end);
        end_time = end_time>0?end_time:75600;

        let curMissedTime = 0;
        let curMissedDate = '';
        let curMissedTimeOffset = 0;

        
        let curItemDate = '';
        let curItemTimeOffset = 0;
        for(let i = 0; i<callbackquery.length; i++){
           
            curItemDate = new Date(callbackquery[i].date).toDateString();
            curItemTimeOffset = this.getTimeOffset(callbackquery[i].date);
            if(callbackquery[i].type === 3){
                if(curMissedTime === 0){
                    if(curItemTimeOffset <=end_time){
                        curMissedTime = callbackquery[i].date;
                    }
                    continue;
                }else{
                    curMissedDate = new Date(curMissedTime).toDateString();
                    
                    curMissedTimeOffset = this.getTimeOffset(curMissedTime);
                    if(curMissedDate == curItemDate){
                        if(curItemTimeOffset <= end_time){
                            continue;
                        }else{
                            // callbackdelay += (end_time - curMissedTimeOffset)*1000;
                            callbackdelaySpan = (end_time - curMissedTimeOffset)*1000;
                            callbackdelay.push({start: curMissedTime, end: (curMissedTime + callbackdelaySpan)});
                            curMissedTime = 0;
                        }
                        continue;
                    }else{
                        // callbackdelay += (end_time - this.max(start_time, curMissedTimeOffset))*1000;
                        let start = curMissedTime + (this.max(start_time, curMissedTimeOffset) - curMissedTimeOffset) * 1000;
                        let end = curMissedTime + (end_time - curMissedTimeOffset) * 1000;
                        callbackdelay.push({start: start, end: end});
                        if(curItemTimeOffset<=end_time){
                            curMissedTime = callbackquery[i].date;
                        }else{
                            curMissedTime = 0;
                        }
                        continue;
                    }
                }
            }else{
                if(curMissedTime === 0){    
                    continue;
                }else{
                    curMissedDate = new Date(curMissedTime).toDateString();
                    curItemDate = new Date(callbackquery[i].date).toDateString();
                    curMissedTimeOffset = this.getTimeOffset(curMissedTime);

                    if(curMissedDate == curItemDate){
                        curItemTimeOffset = this.getTimeOffset(callbackquery[i].date);
                        if(curItemTimeOffset >= start_time){
                            // callbackdelay += (this.min(end_time, curItemTimeOffset) - this.max(start_time, curMissedTimeOffset))*1000;    
                            let start = curMissedTime + (this.max(start_time, curMissedTimeOffset) - curMissedTimeOffset) * 1000;
                            let end = callbackquery[i].date + (this.min(end_time, curItemTimeOffset) - curItemTimeOffset) * 1000;
                            callbackdelay.push({start: start, end: end});
                        }
                        curMissedTime = 0;
                        continue;
                    }else{
                        // callbackdelay += (end_time - this.max(start_time, curMissedTimeOffset))*1000;
                        callbackdelaySpan = (end_time - this.max(start_time, curMissedTimeOffset))*1000;
                        let start = curMissedTime + (this.max(start_time, curMissedTimeOffset) - curMissedTimeOffset) * 1000;
                        let end = start + callbackdelaySpan;
                        callbackdelay.push({start: start, end: end});
                        curMissedTime = 0;
                        continue;
                    }

                }
            }
        }
        if(curMissedTime!==0){
            curMissedTimeOffset = this.getTimeOffset(curMissedTime);
            // callbackdelay +=(end_time - this.max(start_time, curMissedTimeOffset)) * 1000;
            callbackdelaySpan = (end_time - this.max(start_time, curMissedTimeOffset))*1000;
            let start = curMissedTime + (this.max(start_time, curMissedTimeOffset) - curMissedTimeOffset) * 1000;
            let end = start + callbackdelaySpan;
            callbackdelay.push({start: start, end: end});
        }

        return callbackdelay;
    }

    /** get Callbackdelay for one timespan */
    static getCallBackDelayOfOneTimeSpan = function(srcArray, start /**start time */, end /**end time */){
        let callbackdelay = 0;
        let timespans = srcArray.filter(el=>{
            if(el.end>= start && end>=el.start){
                return true;
            }else{
                return false;
            }
        });
        if(timespans.length == 0){
            callbackdelay = 0;
        }else{
            for(let i = 0; i<timespans.length; i++){
                callbackdelay += (this.min(end, timespans[i].end) - this.max(start, timespans[i].start));
            }
        }
        return callbackdelay;
    }

    /** get callbackdelay for hourly */
    static getCallBackDelayOfHourly = function(srcArray, hour){
        let callbackdelay = 0;
        let startDate, endDate, startDateTimeOffset, endDateTimeOffset;
        let endTime = (hour + 1) * 3600; // unit : second
        let startTime = hour * 3600;

        let timespans = srcArray.filter(el=>{
            startDate = new Date(el.start);
            endDate = new Date(el.end);
            if(startDate.getHours()<= hour && endDate.getHours()>=hour){
                return true;
            }else{
                return false;
            }
        });
        for(let i = 0; i<timespans.length; i++){
            startDateTimeOffset = this.getTimeOffset(timespans[i].start);
            endDateTimeOffset = this.getTimeOffset(timespans[i].end);
            callbackdelay +=(this.min(endDateTimeOffset, endTime) - this.max(startDateTimeOffset, startTime));
        }
        return callbackdelay * 1000; // unit shoule be ms
    }

    /** get callbackdelay for day in week */
    static getCallBackDelayOfDayInWeek = function(srcArray, day){
        let callbackdelay = 0;
        let dayOfCurDate;
        let timespans = srcArray.filter(el=>{
            dayOfCurDate = new Date(el.start).getDay();
            if(dayOfCurDate == day){
                return true;
            }else{
                return false;
            }
        });
        for(let i = 0; i<timespans.length; i++){
            callbackdelay +=(timespans[i].end - timespans[i].start);
        }
        return callbackdelay; // unit shoule be ms
    }

    static makeUtcTime = function(localtime){
        let timezoneoffset = new Date().getTimezoneOffset();
        
        let localDayTime = new Date().toDateString() + " " + localtime;
        let utcTimeStamp = new Date(localDayTime).getTime() + timezoneoffset*60000;
        let utcDate = new Date(utcTimeStamp);
        let utcHour = utcDate.getHours();
        let utcHourStr = utcHour>9?utcHour:"0"+utcHour;
        let utcMins = utcDate.getMinutes();
        let utcMinStr = utcMins>9?utcMins:"0"+utcMins;
        let utcSecs = utcDate.getSeconds();
        let utcSecStr = utcSecs>9?utcSecs:"0"+utcSecs;
    
        return ""+utcHourStr+":"+utcMinStr+":"+utcSecStr;
    }

    static makeLocalTime = function(utcTime){
        
        let timezoneoffset = new Date().getTimezoneOffset();
        
        let utcDayTime = new Date().toDateString() + " " + utcTime;
        let localTimeStamp = new Date(utcDayTime).getTime() - timezoneoffset*60000;
        let localDate = new Date(localTimeStamp);
        let localHour = localDate.getHours();
        let localHourStr = localHour>9?localHour:"0"+localHour;
        let localMins = localDate.getMinutes();
        let localMinStr = localMins>9?localMins:"0"+localMins;
        let localSecs = localDate.getSeconds();
        let localSecStr = localSecs>9?localSecs:"0"+localSecs;
    
        return ""+localHourStr+":"+localMinStr+":"+localSecStr;
    }

    static formatDateToLocal = function(timestamp){
        let d = new Date(timestamp);
        return d.toLocaleDateString();
    }


    static formatAMPM = function (timestamp) {
        let date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let strminutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = (hours >= 10 ? hours : ("0" + hours)) + ':' + strminutes + ' ' + ampm;
        return strTime;
    }

}