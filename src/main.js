// For SimpleBar  - Scroll Bar Library
new SimpleBar(document.getElementById("info"), { autoHide: false });

//Selecting Elements
const ipEl = document.getElementById("ip");
const ipTextEl = document.getElementById("ipText");
const providerTextEl = document.getElementById("providerText");
const providerEl = document.getElementById("provider");

//STORING DATA

const data = {
   ipData: {},
   countryData: {},
};

//DATA REQUEST

const getData = async (url) => {
   const recievedData = await fetch(url);
   const data = await recievedData.json();
   return data;
};

//RECIEVEING DATA

getData("https://ipapi.co/json/")
   .then((ipData) => {
      data.ipData = ipData;
      return getData(
         `https://restcountries.eu/rest/v2/alpha/${ipData.country}`
      );
   })
   .then((countryData) => {
      data.countryData = countryData;
      updateUI();
   })
   .catch((err) => {
      ipEl.textContent = "Unable To Fetch";
      providerText.textContent = "Try Refreshing the website";
   });

// UPDATING HTML

const addElement = (parentAt, children) => {
   const parent = document.querySelector(parentAt);

   children.forEach((child) => {
      const childEl = document.createElement(child[0]);
      childEl.textContent = child[1];
      const childAttributes = child[2];

      for (let key in childAttributes) {
         if (childAttributes.hasOwnProperty(key)) {
            childEl.setAttribute(key, childAttributes[key]);
         }
      }

      parent.appendChild(childEl);
   });
};

const updateUI = () => {
   //Change IP Address
   ipEl.textContent = data.ipData.ip;
   ipTextEl.textContent = "is Your IP address";

   //Change Location
   addElement("#location", [
      [
         "p",
         "your ISP location is",
         {
            class: "description --sub",
         },
      ],
      [
         "h2",
         data.ipData.city,
         {
            class: "main-content__location",
         },
      ],
      [
         "span",
         "",
         {
            class: "main-content__break",
         },
      ],
      [
         "h2",
         data.ipData.region,
         {
            class: "main-content__location",
         },
      ],
      [
         "span",
         "",
         {
            class: "main-content__break",
         },
      ],
      [
         "h2",
         data.ipData.country_name,
         {
            class: "main-content__location",
         },
      ],
   ]);

   //Update Provider
   providerTextEl.textContent = "and Your Provider is";
   providerEl.textContent = data.ipData.org;

   //Change Flag & Country
   addElement("#country", [
      [
         "img",
         "",
         {
            class: "extra-content__image",
            src: `https://www.countryflags.io/${data.countryData.alpha2Code}/flat/64.png`,
            alt: "Flag",
         },
      ],
      ["h2", data.countryData.name, {}],
   ]);

   //Store Data

   const cData = data.countryData;
   const iData = data.ipData;

   const dataName = [
      "Calling Code : ",
      "Alternate Names : ",
      "Capital : ",
      "Postal Code : ",
      "Currency : ",
      "Languages : ",
      "Population : ",
      "Sub-Region : ",
      "Timezone : ",
      "Regional Blocs : ",
   ];

   const renderData = [
      iData.country_calling_code,
      cData.altSpellings,
      cData.capital,
      iData.postal,
      cData.currencies[0].name,
      cData.languages,
      cData.population,
      cData.subregion,
      iData.utc_offset + " " + iData.timezone,
      cData.regionalBlocs,
   ];

   //Storing Final Data
   const finalData = getFinalData(dataName, renderData);

   //Rendering Final Data
   renderFinalData(finalData);
};

const getFinalData = (dataName, renderData) => {
   const result = [];

   for (let i = 0; i < renderData.length; i++) {
      if (
         (renderData[i] !== undefined && typeof renderData[i] === "string") ||
         typeof renderData[i] === "number"
      ) {
         result[i] = [dataName[i], renderData[i]];
      } else {
         let filteredData = "";

         for (let key in renderData[i]) {
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

         result[i] = [
            dataName[i],
            filteredData.substring(0, filteredData.length - 2),
         ];
      }
   }

   return result;
};

const renderFinalData = (finalData) => {
   for (let i = 0; i < finalData.length; i++) {
      addElement(".simplebar-content", [
         [
            "div",
            "",
            {
               class: "extra-content__info",
               id: "infoEl-" + i,
            },
         ],
      ]);

      addElement("#infoEl-" + i, [
         ["i", "", { class: "fas fa-angle-right" }],
         ["h2", finalData[i][0], {}],
         ["p", finalData[i][1], {}],
      ]);
   }
};
