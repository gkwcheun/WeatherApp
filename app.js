let onDisplay = [];

async function getWeatherData(city) {
  const apiKey = "b49d81bfc5731de9364e668e91afe55b";
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return processData(data);
  } catch (erorr) {
    console.log("reject", error);
  }
}

function processData(data) {
  let appData = {};
  appData.name = data.name;
  appData.weather = data.weather;
  appData.main = data.main;
  return appData;
}

async function getGif(description) {
  const apiKey = "Zb9f89tOJskNshNLi8D6NYwKdsGGoLuM";
  let url = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKey}&s=${description}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    const gifData = await response.json();
    let gifUrl = gifData.data.images.original.url;
    return gifUrl;
  } catch (error) {
    console.log("reject", error);
  }
}

async function displayData(e) {
  // prevent button from refreshing page on click
  let inp = document.getElementById("input-city");
  e.preventDefault();
  if (inp.value) {
    let inpValue = inp.value.toLowerCase();
    if (!onDisplay.includes(inpValue)) {
      let data = await getWeatherData(inp.value);
      // check if valid data was actually fetched from API (data.name not undefined)
      if (data.name) {
        let weatherGif;
        let description = data.weather[0].description;
        // get last word in weather description if more than two words (ex. broken clouds => clouds),
        // easier to get relevant image from giphy API
        if (/\s/.test(description)) {
          let descriptionArr = description.split(" ");
          weatherGif = await getGif(descriptionArr[descriptionArr.length - 1]);
        } else {
          weatherGif = await getGif(`weather-${data.weather[0].description}`);
        }
        createWeatherCard(data, weatherGif);
        onDisplay.push(inpValue);
      }
    }
    inp.value = "";
  }
}

function createWeatherCard(data, gifUrl) {
  let cardContainer = document.querySelector(".cards-container");
  let imgUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

  let newCard = document.createElement("div");
  newCard.classList.add("weather-card");
  newCard.style.background = `url(${gifUrl}) no-repeat center center`;
  newCard.style.backgroundSize = "cover";

  let city = document.createElement("h1");
  city.classList.add("city");
  city.innerText = data.name;

  let temp = document.createElement("p");
  temp.classList.add("temp");
  temp.innerText = `${data.main.temp} °C`;

  let infoContainer = document.createElement("div");
  infoContainer.classList.add("info");

  let icon = document.createElement("img");
  icon.classList.add("icon");
  icon.src = imgUrl;

  let description = document.createElement("p");
  description.classList.add("description");
  description.innerText = data.weather[0].description;

  infoContainer.appendChild(icon);
  infoContainer.appendChild(description);

  newCard.appendChild(city);
  newCard.appendChild(temp);
  newCard.appendChild(infoContainer);

  cardContainer.appendChild(newCard);
}

let searchBtn = document.querySelector(".search");
searchBtn.addEventListener("click", displayData);
