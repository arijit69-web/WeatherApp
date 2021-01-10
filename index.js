const http = require("http");
const fs = require("fs");
const requests = require("requests");
//Modules
const homefile = fs.readFileSync("home.html", "utf-8");
//reading all the html file and storing in the variable homefile
const replaceVal = (tempVal, orgVal) => {
  var num = orgVal.main.temp - 273.15;
  var n = num.toFixed(2);

  temperature = tempVal.replace("{%tempval%}", n);
  num = orgVal.main.temp_min - 273.15;
  n = num.toFixed(2);

  temperature = temperature.replace("{%tempmin%}", n);
  num = orgVal.main.temp_max - 273.15;
  n = num.toFixed(2);

  temperature = temperature.replace("{%tempmax%}", n);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
//Creating a Server
const server = http.createServer((req, res) => {
  if (req.url == "/") {//homepage
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Dubai&appid=ae1442a2d74584b70d03d6c716cf42cb"
    )//requesting or fetching an API
//inbuilt data event
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);//converting the JSON file of API into objext data
        const arrData = [objdata];//Storing the object data in the form of array
        const realTimeData = arrData.map((val) => replaceVal(homefile, val)).join("");
        res.write(realTimeData);
      })//inbuilt data event is fired when there is data to read
      .on("end", function (err) {
        if (err) return console.log("Connection Closed Due to Errors", err);

        res.end();
      });
  }
});
server.listen(80, "127.0.0.1", () => {
  console.log("The App is running");
});
