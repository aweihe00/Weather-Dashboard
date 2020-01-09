# Weather-Dashboard
Unit 06 Server-Side APIs Homework

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. In this homework assignment, your challenge is to build a weather dashboard using the OpenWeather API.

## Instructions:

Build a weather dashboard application with search functionality to find current weather conditions and the future weather outlook for multiple cities. Following the common templates for user stories, we can frame this challenge as follows:

As a traveler
I want to see the weather outlook for multiple cities
so that I can plan a trip accordingly
How do you deliver this? Here are some guidelines:

![capture](https://user-images.githubusercontent.com/56567819/71109993-0b7b7600-218c-11ea-9e8d-f3b5bad0c242.png)

Link to deployed site https://aweihe00.github.io/Weather-Dashboard/

Use the OpenWeather API to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions.

Use AJAX to hook into the API to retrieve data in JSON format.

Your app will run in the browser and feature dynamically updated HTML and CSS powered by jQuery.

Display the following under current weather conditions:
1. City
2. Date
3. Icon image (visual representation of weather conditions)
4. Temperature
5. Humidity
6. Wind speed
7. UV index

Include a search history so that users can access their past search terms. Clicking on the city name should perform a new search that returns current and future conditions for that city.

Include a 5-Day Forecast below the current weather conditions. Each day for the 5-Day Forecast should display the following:
1. Date
2. Icon image (visual representation of weather conditions)
3. Temperature
4. Humidity
