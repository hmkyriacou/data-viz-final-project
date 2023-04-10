import { select, arc } from "d3";
import * as topojson from "topojson-client";
import scatterPlot, { scatterdestroy } from "./scatterPlot";
import map, { mapdestroy } from "./map";
import lineChart, { linedestroy } from "./lineChart";
import { legend } from "./legend";
import { menu } from "./menu";
import { monthSelect } from "./monthSelect";

export const viz = (container, { state, setState }) => {
  const selectors = select(container)
    .selectAll("div.selectors")
    .data([null])
    .join("div")
    .attr("class", "selectors");

  selectors.call(legend, {
    title: { value: "weathertype", label: "Weather Type" },
    optionsData: [
      { value: "temperature", label: "Temperature" },
      { value: "rainfall", label: "Rainfall" },
      { value: "snowfall", label: "Snowfall" },
    ],
    onChange: (value) => {
      setState((state) => ({
        ...state,
        weather_type: value,
      }));
    },
    legendType: menu,
  });

  selectors.call(legend, {
    title: { value: "monthselect", label: "Select which months to view" },
    optionsData: [
      { value: "Sep", label: "September" },
      { value: "Oct", label: "October" },
      { value: "Nov", label: "November" },
      { value: "Dec", label: "December" },
      { value: "Jan", label: "January" },
      { value: "Feb", label: "Feburary" },
    ],
    onChange: (months) => {
      setState((state) => ({
        ...state,
        months,
      }));
    },
    legendType: monthSelect,
  });

  const width = container.offsetWidth;
  const height = window.innerHeight - selectors.node().offsetHeight;

  const div = select(container)
    .selectAll("div.chart")
    .data([null])
    .join("div")
    .attr("class", "chart")
    .attr("width", width)
    .attr("height", height);

  const transform_city = (t) => {
    if (t === "Washington Redskins" || t === "Washington Football Team") {
      t = "Washington Commanders";
    }

    if (t === "Oakland Raiders") {
      t = "Las Vegas Raiders";
    }

    if (t === "St. Louis Rams") {
      t = "Los Angeles Rams";
    }

    if (t === "San Diego Chargers") {
      t = "Los Angeles Chargers";
    }

    return t;
  };

  const convertMonth = (m) => {
    if (m == "Sep") {
      return 9;
    }
    if (m == "Oct") {
      return 10;
    }
    if (m == "Nov") {
      return 11;
    }
    if (m == "Dec") {
      return 12;
    }
    if (m == "Jan") {
      return 1;
    }
    if (m == "Feb") {
      return 2;
    }
  };

  const { data, weather_data, meta_data, map_data, months /*climate_zones*/ } =
    state;

  if (
    weather_data !== undefined &&
    weather_data !== "LOADING" &&
    meta_data !== undefined &&
    meta_data !== "LOADING" &&
    map_data !== undefined &&
    map_data !== "LOADING" &&
    //(climate_zones !== undefined && climate_zones !== 'LOADING') &&
    data === undefined
  ) {
    setState((state) => ({
      ...state,
      data: "LOADING",
    }));

    fetch(
      "https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/data.json"
    )
      .then((res) => res.json())
      .then((rawdata) => {
        let teamsObj = {};

        for (const year of [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]) {
          for (const week in rawdata[year]) {
            for (const game in rawdata[year][week]) {
              rawdata[year][week][game]["away_score"] =
                +rawdata[year][week][game]["away_score"];
              rawdata[year][week][game]["home_score"] =
                +rawdata[year][week][game]["home_score"];

              let home_team = transform_city(game.split("_")[1]);
              let away_team = transform_city(game.split("_")[0]);

              if (teamsObj[away_team] === undefined) {
                teamsObj[away_team] = {
                  away_wins: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  home_wins: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  tot_games: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  home_games: {
                    Sep: 0,
                    Oct: 0,
                    Nov: 0,
                    Dec: 0,
                    Jan: 0,
                    Feb: 0,
                  },
                  away_games: {
                    Sep: 0,
                    Oct: 0,
                    Nov: 0,
                    Dec: 0,
                    Jan: 0,
                    Feb: 0,
                  },
                };
              }

              if (teamsObj[home_team] === undefined) {
                teamsObj[home_team] = {
                  away_wins: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  home_wins: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  tot_games: { Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0 },
                  home_games: {
                    Sep: 0,
                    Oct: 0,
                    Nov: 0,
                    Dec: 0,
                    Jan: 0,
                    Feb: 0,
                  },
                  away_games: {
                    Sep: 0,
                    Oct: 0,
                    Nov: 0,
                    Dec: 0,
                    Jan: 0,
                    Feb: 0,
                  },
                };
              }

              let date;
              if (rawdata[year][week][game]["date"].includes("Sep")) {
                date = "Sep";
              }
              if (rawdata[year][week][game]["date"].includes("Oct")) {
                date = "Oct";
              }
              if (rawdata[year][week][game]["date"].includes("Nov")) {
                date = "Nov";
              }
              if (rawdata[year][week][game]["date"].includes("Dec")) {
                date = "Dec";
              }
              if (rawdata[year][week][game]["date"].includes("Jan")) {
                date = "Jan";
              }
              if (rawdata[year][week][game]["date"].includes("Feb")) {
                date = "Feb";
              }

              if (
                rawdata[year][week][game]["away_score"] >
                rawdata[year][week][game]["home_score"]
              ) {
                teamsObj[away_team].away_wins[date]++;
              } else {
                teamsObj[home_team].home_wins[date]++;
              }
              teamsObj[away_team].tot_games[date]++;
              teamsObj[home_team].tot_games[date]++;
              teamsObj[away_team].away_games[date]++;
              teamsObj[home_team].home_games[date]++;

              if (teamsObj[away_team].city === undefined) {
                teamsObj[away_team].city = away_team.substring(
                  0,
                  away_team.lastIndexOf(" ")
                );

                teamsObj[away_team].team = away_team.substring(
                  away_team.lastIndexOf(" ") + 1
                );
              }

              if (teamsObj[home_team].city === undefined) {
                teamsObj[home_team].city = home_team.substring(
                  0,
                  home_team.lastIndexOf(" ")
                );

                teamsObj[home_team].team = home_team.substring(
                  home_team.lastIndexOf(" ") + 1
                );
              }
            }
          }
        }

        //console.log(teamsObj)

        const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

        for (let team in teamsObj) {
          // Home Field Win Percentage
          teamsObj[team].winPct = {
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
            Jan: 0,
            Feb: 0,
          };
          months.forEach((m) => {
            if (teamsObj[team].home_games[m] === 0) {
              teamsObj[team].winPct[m] = 0;
            } else {
              teamsObj[team].winPct[m] =
                teamsObj[team].home_wins[m] / teamsObj[team].home_games[m];
            }
          });

          // Percent of wins at home
          teamsObj[team].pctWinsAtHome = {
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
            Jan: 0,
            Feb: 0,
          };
          months.forEach((m) => {
            if (
              teamsObj[team].home_wins[m] + teamsObj[team].away_wins[m] ===
              0
            ) {
              teamsObj[team].pctWinsAtHome[m] = 0;
            } else {
              teamsObj[team].pctWinsAtHome[m] =
                teamsObj[team].home_wins[m] /
                (teamsObj[team].home_wins[m] + teamsObj[team].away_wins[m]);
            }
          });
        }

        for (let team in teamsObj) {
          // console.log(weather_data[teamsObj[team].city], teamsObj[team].city)
          //console.log(teamsObj[team].city, Object.keys(weather_data))
          const wdata = weather_data[teamsObj[team].city].filter((d) =>
            [9, 10, 11, 12, 1, 2].includes(d.MONTH)
          );

          teamsObj[team].temp =
            wdata
              .map((m) => {
                teamsObj[team][`temp_${m.MONTH}`] = m["MLY-AVG-TEMP"];
                return m["MLY-AVG-TEMP"];
              })
              .reduce((p, c) => p + c, 0) / 6;

          teamsObj[team].rainfall =
            wdata
              .map((m) => {
                teamsObj[team][`rainfall_${m.MONTH}`] = m["MLY-PRCP-NORMAL"];
                return m["MLY-PRCP-NORMAL"];
              })
              .reduce((p, c) => p + c, 0) / 6;

          teamsObj[team].snowfall =
            wdata
              .map((m) => {
                teamsObj[team][`snowfall_${m.MONTH}`] = m["MLY-SNOW-NORMAL"];
                return m["MLY-SNOW-NORMAL"];
              })
              .reduce((p, c) => p + c, 0) / 6;

          const temp_obj = meta_data[teamsObj[team].city] || meta_data[team];
          teamsObj[team].img = temp_obj.img;
          teamsObj[team].location = temp_obj.location;
        }

        //console.log(teamsObj)

        setState((state) => ({
          ...state,
          data: Object.values(teamsObj),
        }));
      });
  } else if (data && data !== "LOADING") {
    console.log(state);
    let yValue = (d) => {
      if (months && months.length !== 0) {
        let avg = 0;
        months.forEach((m) => {
          avg += d[`temp_${convertMonth(m)}`];
        });
        return avg / months.length;
      }
      return d.temp;
    };
    let yLabel = "City Average Monthly Temperature (°F)";
    let yDomain = [30, 80];

    if (state.weather_type === "rainfall") {
      yValue = (d) => {
        if (months && months.length !== 0) {
          let avg = 0;
          months.forEach((m) => {
            avg += d[`rainfall_${convertMonth(m)}`];
          });
          return avg / months.length;
        }
        return d.rainfall;
      };
      yLabel = "City Average Monthly Rainfall (in)";
    } else if (state.weather_type === "snowfall") {
      yValue = (d) => {
        if (months && months.length !== 0) {
          let avg = 0;
          months.forEach((m) => {
            avg += d[`snowfall_${convertMonth(m)}`];
          });
          return avg / months.length;
        }
        return d.snowfall;
      };
      yLabel = "City Average Monthly Snowfall (in)";
    }

    let xValue = (d) => {
      let winPct = 0;
      let totGames = 0;
      if (months && months.length !== 0) {
        months.forEach((m) => {
          winPct += d.home_wins[m];
          totGames += d.home_games[m];
        });
        winPct = winPct / totGames;
      } else {
        for (const m in d.winPct) {
          winPct += d.home_wins[m];
          totGames += d.home_games[m];
        }
        winPct = winPct / totGames;
      }
      //console.log(winPct, totGames)

      return winPct;
    };
    let xLabel = "Home Field Win Percentage";

    const mapSvg = div
      .selectAll("svg.map")
      .data([null])
      .join("svg")
      .attr("class", "map")
      .attr("width", width)
      .attr("height", height / 2);

    mapSvg.call(map, {
      width,
      height: height / 2,
      xValue,
      xLabel,
      yValue,
      yLabel,
      zValue: (d) => d.img,
      title: "Map of home team win percentage and climate regions",
      data: map_data,
      team_data: data,
      state,
      setState,
    });

    const scatterSvg = div
      .selectAll("svg.scatter")
      .data([null])
      .join("svg")
      .attr("class", "scatter")
      .attr("width", width)
      .attr("height", height / 2);

    scatterSvg.call(scatterPlot, {
      data: data.filter((e) => {
        return !isNaN(xValue(e));
      }),
      width,
      height: height / 2,
      xValue,
      xLabel,
      yValue,
      yLabel,
      yDomain,
      zValue: (d) => d.img,
      title:
        "Does the average weather at home affect home team Win Percentage?",
      margin: {
        left: 75,
        right: 50,
        bottom: 75,
        top: 100,
      },
      state,
      setState,
    });
  } else if (weather_data === undefined) {
    setState((state) => ({
      ...state,
      weather_data: "LOADING",
      meta_data: "LOADING",
      map_data: "LOADING",
      climate_zones: "LOADING",
    }));

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((res) => res.json())
      .then((topoJSONdata) => {
        const map_data = topojson.feature(topoJSONdata, "states");
        //console.log(map_data)
        setState((state) => ({
          ...state,
          map_data,
        }));
      });

    // fetch('https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/topo.json')
    //     .then((res) => res.json())
    //     .then(topoJSONdata => {
    //         const climate_zones = topojson.feature(
    //             topoJSONdata,
    //             "geo"
    //         )
    //         //console.log(map_data)
    //         setState((state) => ({
    //             ...state,
    //             climate_zones
    //         }))
    //     })

    fetch(
      "https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/meta-data.json"
    )
      .then((res) => res.json())
      .then((rawdata) => {
        setState((state) => ({
          ...state,
          meta_data: rawdata,
        }));
      });

    fetch(
      "https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/weather_data.json"
    )
      .then((res) => res.json())
      .then((rawdata) => {
        setState((state) => ({
          ...state,
          weather_data: rawdata,
        }));
      });
  }
};
