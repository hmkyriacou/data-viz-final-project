# Data Visualization Project

## Data

The data I visualized for my project is both NFL Matchup Data and weather data for the cities that host NFL teams.

## Prototypes

I’ve created a proof of concept visualization of this data. It's a scatterplot and it shows a teams average home field temperature verse home field win percentage.

[![image](https://user-images.githubusercontent.com/30053669/220140963-8b7ab90a-5aae-4ea5-a401-d41af17d0309.png
)](https://vizhub.com/hmkyriacou/81abb1acee7349318800e1c420590a49)

Also, this earlier prototype shows only four teams win percentage but using a piechart (angles) as the channel rather than x, y position.

[![image](https://user-images.githubusercontent.com/30053669/220141812-1b78aa11-bfa2-4a71-8de4-7266d3b5cb75.png)](https://vizhub.com/hmkyriacou/3a6357c278ee48e7927a2e32c2d3f356)


## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * Is there a relationship between home field temperature and home team advantage?
 * Is there a relationship between home field rain/snow percipatation and home team advantage?
 * Are there any other patterns in what teams have historically been very good at winning at home but not while away?

## Sketches

![image](https://user-images.githubusercontent.com/30053669/220146690-71412898-0f5f-4c06-a0ca-c8b877cb3617.png)

This sketch shows my plan to plot the teams according to their geological location and then show their win percentages on a pie chart. The weather would be encoded with "climate lines" that change based on the selection of temperature or percipation.

After doing the scatter plot assignment though, I think having a scatter plot in addition to the map would be helpful. The user can switch between views to compare geological regions (on the map) to comparing teams (on the scatter plot).

## Open Questions

* I am worried there will not be a visable correlation, the scatter plot I made shows a slight correlation with temperature I think, but I am hoping that adding more configurations (like percipation or during certain months) will make the home field advantage clearer.
* I have been unable to find really good weather data. So far, I have only been able to piece the average temperature from several different sources and I haven't found average percipation by city yet either.

## Link to running site
http://nfl-homefield-advtg-viz.s3-website.us-east-2.amazonaws.com/

## Milestones

* Week 7 - ~~Start finding better weather data and incorporate into the scatter plot~~
* Week 8 - ~~Implement temperature/percipation switching~~
* Week 9 - ~~Add month selections~~
* Week 10 - ~~Add a switch to switch between "Map View" and "Scatterplot View"~~
* Week 11 - ~~Add teams onto the Map View~~
* Week 12 - ~~Add "climate lines" to Map View~~
* Week 13 - Add a way to visualize Home Field Advantage vs How a team does when playing away
* Week 14 - Implement the Home Field Advantage vs away team advantage in some way
