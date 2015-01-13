(function (global) {
     var  app = global.app = global.app || {};     
     app.Utility = {
         getDate: function(date){
             var options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
            var dateArray = date.match(app.dateRegex).slice(1);
            var dt = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + " " + dateArray[3] + ":" + dateArray[4] + ":" + dateArray[5] + ":" + dateArray[6];
            var currentDate = new Date(dt);
            return currentDate.toLocaleString("en-us",options).replace(/,/g , "");
         }, 
          getTodayDate: function(){
             var options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };          
            var currentDate = new Date();
            return currentDate.toLocaleString("en-us",options).replace(/,/g , "");
         }         
     }
})(window);