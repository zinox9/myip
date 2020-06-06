"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// For SimpleBar  - Scroll Bar Library
new SimpleBar(document.getElementById("info"), {
  autoHide: false
}); //Selecting Elements

var ipEl = document.getElementById("ip");
var ipTextEl = document.getElementById("ipText");
var providerTextEl = document.getElementById("providerText");
var providerEl = document.getElementById("provider"); //STORING DATA

var data = {
  ipData: {},
  countryData: {}
}; //DATA REQUEST

var getData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (url) {
    var recievedData = yield fetch(url);
    var data = yield recievedData.json();
    return data;
  });

  return function getData(_x) {
    return _ref.apply(this, arguments);
  };
}(); //RECIEVEING DATA


getData("https://ipapi.co/json/").then(function (ipData) {
  data.ipData = ipData;
  return getData("https://restcountries.eu/rest/v2/alpha/".concat(ipData.country));
}).then(function (countryData) {
  data.countryData = countryData;
  updateUI();
}).catch(function (err) {
  console.log(err);
  ipEl.textContent = "Unable To Fetch";
  providerText.textContent = "Try Refreshing the website";
}); // UPDATING HTML

var addElement = function addElement(parentAt, children) {
  var parent = document.querySelector(parentAt);
  children.forEach(function (child) {
    var childEl = document.createElement(child[0]);
    childEl.textContent = child[1];
    var childAttributes = child[2];

    for (var key in childAttributes) {
      if (childAttributes.hasOwnProperty(key)) {
        childEl.setAttribute(key, childAttributes[key]);
      }
    }

    parent.appendChild(childEl);
  });
};

var updateUI = function updateUI() {
  //Change IP Address
  var ipAdd = data.ipData.ip;

  if (ipAdd.includes("::")) {
    var location = ipAdd.indexOf("::");
    ipAdd = ipAdd.substring(0, location);
  }

  ipEl.textContent = ipAdd;
  ipTextEl.textContent = "is Your IP address"; //Change Location

  addElement("#location", [["p", "your ISP location is", {
    class: "description --sub"
  }], ["h2", data.ipData.city, {
    class: "main-content__location"
  }], ["span", "", {
    class: "main-content__break"
  }], ["h2", data.ipData.region, {
    class: "main-content__location"
  }], ["span", "", {
    class: "main-content__break"
  }], ["h2", data.ipData.country_name, {
    class: "main-content__location"
  }]]); //Update Provider

  providerTextEl.textContent = "and Your Provider is";
  providerEl.textContent = data.ipData.org; //Change Flag & Country

  addElement("#country", [["img", "", {
    class: "extra-content__image",
    src: "https://www.countryflags.io/".concat(data.countryData.alpha2Code, "/flat/64.png"),
    alt: "Flag"
  }], ["h2", data.countryData.name, {}]]); //Store Data

  var cData = data.countryData;
  var iData = data.ipData;
  var dataName = ["Calling Code : ", "Alternate Names : ", "Capital : ", "Postal Code : ", "Currency : ", "Languages : ", "Population : ", "Sub-Region : ", "Timezone : ", "Regional Blocs : "];
  var renderData = [iData.country_calling_code, cData.altSpellings, cData.capital, iData.postal, cData.currencies[0].name, cData.languages, cData.population, cData.subregion, iData.utc_offset + " " + iData.timezone, cData.regionalBlocs]; //Storing Final Data

  var finalData = getFinalData(dataName, renderData); //Rendering Final Data

  renderFinalData(finalData);
};

var getFinalData = function getFinalData(dataName, renderData) {
  var result = [];

  for (var i = 0; i < renderData.length; i++) {
    if (renderData[i] !== undefined && typeof renderData[i] === "string" || typeof renderData[i] === "number") {
      result[i] = [dataName[i], renderData[i]];
    } else {
      var filteredData = "";

      for (var key in renderData[i]) {
        if (renderData[i].hasOwnProperty(key)) {
          if (i === 1) {
            filteredData += renderData[i][key] + ", ";
          } else if (i === 5) {
            filteredData += renderData[i][key].name + ", ";
          } else if (i === 9) {
            filteredData += renderData[i][key].acronym + ", ";
          }
        }
      }

      result[i] = [dataName[i], filteredData.substring(0, filteredData.length - 2)];
    }
  }

  return result;
};

var renderFinalData = function renderFinalData(finalData) {
  for (var i = 0; i < finalData.length; i++) {
    addElement("#info .simplebar-content", [["div", "", {
      class: "extra-content__info",
      id: "infoEl-" + i
    }]]);
    addElement("#infoEl-" + i, [["i", "", {
      class: "fas fa-angle-right"
    }], ["h2", finalData[i][0], {}], ["p", finalData[i][1], {}]]);
  }
};

//# sourceMappingURL=script.js.map