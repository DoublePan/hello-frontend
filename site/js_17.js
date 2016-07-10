/**
 *aqiSourceData {
    "city"： {
        "date": 10,
        "date": 11
    }  
 }
 *
 */


var aqiSourceData={
  "北京": buildSourceData(),
  "厦门": buildSourceData()
  };
var aqiChartData={

}

var aqiPara={
  "city": "",
  "intervel": ""
}

/**
 *function initPara()
 *
 */

function initPara() {
  var cityStr=document.getElementById("city-select").value;
  aqiPara.city=cityStr;

  var intervalRadios=document.getElementById("intervel-fs").getElementsByTagName("input");
  for (var i=0; i< intervalRadios.length; i++)  {
    if(intervalRadios[i].checked) {
      if (intervalRadios[i].value=="day") {
        aqiPara.intervel="day";
      } else if (intervalRadios[i].value=="week") {
          aqiPara.intervel="week";
        }
    }
  }

  console.log(aqiPara);
  console.log(aqiPara.intervel);
}


/**
 *function buildSourceData()
 *
 */

function buildSourceData() {
    var returnAqi={};
    var startDate=new Date("2016-01-01");
    var endDate=new Date("2016-03-31");
    var duration=(endDate-startDate)/(1000*60*60*24);
    var dt=startDate;
    for (var i=0;i<=duration;i++) {
      returnAqi[dt]=Math.round(Math.random()*100); 
      dt.setDate(dt.getDate()+1);
    }
    return returnAqi;
}


/**
 *function buildChartData(intervel)
 *aqiChartData根据时间粒度存储空气质量；
 */

function buildChartData() {
  var aqiChartDataDate={};
  //get the specify city's aqi
  for (var key in aqiSourceData) {
    if (key==aqiPara.city) {
      aqiChartDataDate=aqiSourceData[key];
    }
  }


  if (aqiPara.intervel=="day") {
    aqiChartData=aqiChartDataDate;
    return 1;
  } else if (aqiPara.intervel=="week") {
      aqiChartData={}; //null out chartdata first
      var dayCnt=0;
      var aqiAvg=0;  
      for (var key2 in aqiChartDataDate) {
        dayCnt++;
        aqiAvg+=aqiChartDataDate[key2];
        var dt=new Date(key2);
        if (dt.getDay()==0)  {//last day of the week 
          aqiAvg/= dayCnt;
          aqiChartData[dt]=aqiAvg;
          aqiAvg=0;
          dayCnt=0;   
        }
   
      }
      return 2;
    }


}
  

 /**
 *function initSelectOption()
 *
 */
function initSelectOption() {
  var citySelect=document.getElementById("city-select");
  for (var key in aqiSourceData) {
    var cityOption=document.createElement("option");
    cityOption.innerHTML=key;
    citySelect.appendChild(cityOption);
  }

}


 /**
 *function renderChart()
 *
 */
function renderChart() {
  initPara();
  buildChartData();
  var chartDiv=document.getElementById("chart-div");
  chartDiv.innerHTML="";
  for (var key in aqiChartData) {
    var dt=new Date(key);
    var chartBar=document.createElement("div");
    chartBar.style.border="1px solid grey";
    chartBar.style.display="inline-block";
    if (aqiPara.intervel=="day") {
      chartBar.style.width="5px";
    } else  {
        chartBar.style.width="30px";
      } 
    chartBar.style.height=aqiChartData[key]+"px";
    chartBar.style.margin="0px 0px";
    chartBar.title=dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate();
    chartDiv.appendChild(chartBar);

  }
}

 /**
 *
 *
 */


  /**
 *
 *
 */

  /**
 *
 *test function
 */

function test() {
  var aqiForm=document.getElementById("aqi-form");
  aqiForm.addEventListener("change",renderChart);

  initSelectOption();
  // console.log((endDate-startDate)/(1000*60*60*24));
  buildSourceData();
  // for (var key in aqiSourceData) {
  //   console.log(aqiSourceData[key]);
  //   for (var key2 in aqiSourceData[key]) 
  //     console.log(aqiSourceData[key][key2]);
  // }
  
  // console.log(aqiChartData);

  renderChart();
  
}

test();