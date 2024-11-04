let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let searchForm = document.querySelector("[datasearchform]")
let grantAccessContainer = document.querySelector(".grantlocationcontainer");
let userweathercontainer = document.querySelector(".userweatherinfocontainer")
let loadingContainer = document.querySelector(".loadingcontainer");
let errorContainer = document.querySelector(".errorcontainer");

let currentTab = userTab;
console.log('hi');
const API_KEY = "e84bf99a8dbd733c2975e32019b8444d";
currentTab.classList.add("current-tab");
console.log('hi');
getfromStorage();

function  switchTab(tab)
{
    errorContainer.classList.remove("active");
    if(currentTab != tab)
    {  
        currentTab.classList.remove("current-tab");
        currentTab = tab;
        currentTab.classList.add("current-tab");
       
        if(!searchForm.classList.contains("active"))
        {
            grantAccessContainer.classList.remove("active");
            userweathercontainer.classList.remove("active");
           // errorContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            searchForm.classList.remove("active");
            userweathercontainer.classList.remove("active");
            //errorContainer.classList.remove("active");

            //let location by lattitude and longitude
            getfromStorage();

        }


    }
}
userTab.addEventListener('click',()=>{switchTab(userTab);});
searchTab.addEventListener('click',()=>{switchTab(searchTab);});

function getfromStorage()
{
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    grantAccessContainer.classList.add("active");
    else
   {
     let coordinates = JSON.parse(localCoordinates); //convert json string to json object
     fetchUserWeather(coordinates);

   } 
}
async function  fetchUserWeather(coordinates)
{
    let {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let content = await response.json();
    loadingContainer.classList.remove("active");
    userweathercontainer.classList.add("active");
    renderWeatherInfo(content);

    }
   catch(e)
   {
     loadingContainer.classList.remove("active");
     alert("Failed to fetch weather. Please try again");
   }

}

function renderWeatherInfo(content)
{
    let city = document.querySelector(".cityname");
    let countryflag = document.querySelector(".countryflag");
    let weatherdescription = document.querySelector("[weatherdescription]")
    let weathericon =  document.querySelector(".weathericon");
    let temperature = document.querySelector("[data-temperature]");
    let windspeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let cloud = document.querySelector("[data-clouds]");

  //fetch values from json object
  city.innerText = content?.name;
  countryflag.src = `https://flagcdn.com/144x108/${content?.sys?.country.toLowerCase()}.png`;
  weatherdescription.innerText = content?.weather?.[0]?.description;//see
  weathericon.src = `http://openweathermap.org/img/w/${content?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${content?.main?.temp}°C`;
  windspeed.innerText = `${content?.wind?.speed}m/s`;
  humidity.innerText = `${content?.main?.humidity}%`;
  cloud.innerText = `${content?.clouds?.all}%`;

console.log("yo")
}
let grantaccessbtn = document.querySelector(".grantaccessbtn");
let searchInput = document.querySelector("[datasearchinput]");
function getlocation()
{
    if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showPosition);
    else
    alert("Geolocation support not available");
}
function showPosition(position)
{
  let userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude, //see
  };
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)); //convert to json string
  //see
  fetchUserWeather(userCoordinates);

}
grantaccessbtn.addEventListener('click',getlocation);
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city = searchInput.value;
    searchInput.value = "";
    if(city === "")
    return;
    else
    fetchCityWeather(city)
})
async function fetchCityWeather(city)
{
    errorContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    userweathercontainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    
    try{
         let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
         let content = await response.json();
         if(!content.sys)
         {
          throw content;
         }
         loadingContainer.classList.remove("active");
         userweathercontainer.classList.add("active"); //see
         renderWeatherInfo(content);
    }
    catch(err)
    {
        loadingContainer.classList.remove("active");
        errorContainer.classList.add("active");
    }
}


