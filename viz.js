import { select, arc } from 'd3';
import * as topojson from 'topojson-client';
import { scatterPlot } from './scatterPlot'
import { map } from './map'
import { lineChart } from './lineChart'

function radio(selection, { name, l, handleChange }) {

    selection
        .selectAll(`h3.${name}`)
        .data([null])
        .join('h3')
        .attr('class', name)
        .text(name)

    selection
        .selectAll(`input.${l}`)
        .data([l])
        .join('input')
        .attr('class', l)
        .attr('type', 'radio')
        .attr('name', name)
        .attr('id', (d) => d)
        .attr('value', (d) => d)
        .on("change", handleChange)

    selection
        .selectAll(`label.${l}`)
        .data([l])
        .join('label')
        .attr('class', l)
        .attr('for', (d) => d)
        .text((d) => d)
        .selectAll(`br.${l}`)
        .data([null])
        .join('br')
        .attr('class', l)

}

export const viz = (container,
    { state, setState }) => {

        const legend_holder = select(container)
            .selectAll('div.legend_holder')
            .data([null])
            .join('div')
            .attr('class', 'legend_holder')

        const legend = legend_holder
            .selectAll('div.legend')
            .data([null])
            .join('div')
            .attr('class', 'legend');


        const handleChange = (e) => {

            setState((state) => ({
                ...state,
                weather_type: e.target.value
            }))
        }

        ['Temperature', 'Rainfall', 'Snowfall'].map((d) => {
            legend
                .call(radio, { name: "weather_type", l: d, handleChange })
        });

        const legend2 = legend_holder
            .selectAll('div.legend2')
            .data([null])
            .join('div')
            .attr('class', 'legend2');

        const handleWinPctTypeChange = (e) => {
            setState((state) => ({
                ...state,
                win_pct_type: e.target.value
            }))
        }

        ['Home_Field_Win_Percentage', 'Percent_of_Wins_at_Home'].map((d) => {
            legend2
                .call(radio, { name: "win_pct_type", l: d, handleChange: handleWinPctTypeChange })
        });

        const LineSelect = legend_holder
            .selectAll('div.LineSelect')
            .data([null])
            .join('div')
            .attr('class', 'LineSelect');

        const handleLineSelectChange = (e) => {
            setState((state) => ({
                ...state,
                line_select: e.target.value
            }))
        }

        ['Scatter_Plot', 'Line_Chart', 'Map'].map((d) => {
            LineSelect
                .call(radio, { name: "line_select", l: d, handleChange: handleLineSelectChange })
        });

        const legend_height = legend_holder.node().offsetHeight
        const height = window.innerHeight - legend_height;
        const width = window.innerWidth;


        const svg = select(container)
            .selectAll('svg.chart')
            .data([null])
            .join('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
            .attr("style", "border:1px solid black; box-sizing: border-box;")

        const transform_city = (t) => {
            if (t === "Washington Redskins" || t === "Washington Football Team") {
                t = "Washington Commanders"
            }

            if (t === "Oakland Raiders") {
                t = "Las Vegas Raiders"
            }

            if (t === "St. Louis Rams") {
                t = "Los Angeles Rams"
            }

            if (t === "San Diego Chargers") {
                t = "Los Angeles Chargers"
            }

            return t
        }

        const { data, weather_data, meta_data, map_data } = state

        if ((weather_data !== undefined && weather_data !== 'LOADING') && 
            (meta_data !== undefined && meta_data !== 'LOADING') && 
            (map_data !== undefined && map_data !== 'LOADING') &&
            data === undefined) {

            setState((state) => ({
                ...state,
                data: 'LOADING',
            }));

            fetch('https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/data.json')
                .then((res) => res.json())
                .then((rawdata) => {

                    let teamsObj = {}

                    for (const year of [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]) {
                        for (const week in rawdata[year]) {
                            for (const game in rawdata[year][week]) {
                                rawdata[year][week][game]["away_score"] = +rawdata[year][week][game]["away_score"]
                                rawdata[year][week][game]["home_score"] = +rawdata[year][week][game]["home_score"]



                                let home_team = transform_city(game.split('_')[1])
                                let away_team = transform_city(game.split('_')[0])

                                if (teamsObj[away_team] === undefined) {
                                    teamsObj[away_team] = {
                                        away_wins: 0,
                                        home_wins: 0,
                                        tot_games: 0,
                                        home_games: 0,
                                        away_games: 0
                                    }
                                }

                                if (teamsObj[home_team] === undefined) {
                                    teamsObj[home_team] = {
                                        away_wins: 0,
                                        home_wins: 0,
                                        tot_games: 0,
                                        home_games: 0,
                                        away_games: 0
                                    }
                                }

                                if (rawdata[year][week][game]["away_score"] > rawdata[year][week][game]["home_score"]) {
                                    teamsObj[away_team].away_wins++
                                } else {
                                    teamsObj[home_team].home_wins++
                                }
                                teamsObj[away_team].tot_games++
                                teamsObj[home_team].tot_games++
                                teamsObj[away_team].away_games++
                                teamsObj[home_team].home_games++

                                if (teamsObj[away_team].city === undefined) {
                                    teamsObj[away_team].city = away_team.substring(0, away_team.lastIndexOf(" "))
                                }

                                if (teamsObj[home_team].city === undefined) {
                                    teamsObj[home_team].city = home_team.substring(0, home_team.lastIndexOf(" "))
                                }

                            }
                        }

                    }

                    console.log(teamsObj)

                    for (let team in teamsObj) {

                        // Home Field Win Percentage
                        teamsObj[team].winPct = teamsObj[team].home_wins / teamsObj[team].home_games

                        // Percent of wins at home
                        teamsObj[team].pctWinsAtHome = teamsObj[team].home_wins / (teamsObj[team].home_wins + teamsObj[team].away_wins)

                    }


                    for (let team in teamsObj) {
                        //console.log(weather_data[teamsObj[team].city], teamsObj[team].city)
                        teamsObj[team].temp = weather_data[teamsObj[team].city].map((m) => {
                            return m['MLY-AVG-TEMP']
                        }).reduce((p, c) => p + c, 0) / 12
                        //console.log(teamsObj[team].temp)
                        teamsObj[team].img = meta_data[teamsObj[team].city]?.img || meta_data[team].img
                        teamsObj[team].location = meta_data[teamsObj[team].city]?.location || meta_data[team].location

                        teamsObj[team].rainfall = weather_data[teamsObj[team].city].map((m) => {
                            return m['MLY-PRCP-NORMAL']
                        }).reduce((p, c) => p + c, 0) / 12

                        teamsObj[team].snowfall = weather_data[teamsObj[team].city].map((m) => {
                            return m['MLY-SNOW-NORMAL']
                        }).reduce((p, c) => p + c, 0) / 12
                    }

                    //console.log(teamsObj)

                    setState((state) => ({
                        ...state,
                        data: Object.values(teamsObj)
                    }))
                })


        } else if (data && data !== "LOADING") {

            let yValue = (d) => d.temp
            let yLabel = "City Average Monthly Temperature (°F)"

            if (state.weather_type === "Temperature") {
                yValue = (d) => d.temp
                yLabel = "City Average Monthly Temperature (°F)"
            } else if (state.weather_type === "Rainfall") {
                yValue = (d) => d.rainfall
                yLabel = "City Average Monthly Rainfall (in)"
            } else if (state.weather_type === "Snowfall") {
                yValue = (d) => d.snowfall
                yLabel = "City Average Monthly Snowfall (in)"
            }

            let xValue = (d) => d.winPct
            let xLabel = "Home Field Win Percentage"

            if (state.win_pct_type === 'Home_Field_Win_Percentage') {
                xValue = (d) => d.winPct
                xLabel = "Home Field Win Percentage"
            } else if (state.win_pct_type === 'Percent_of_Wins_at_Home') {
                xValue = (d) => d.pctWinsAtHome
                xLabel = "Percent of Team wins at home"
            }
            if (state.line_select === undefined || state.line_select === "Scatter_Plot") {
                svg.selectAll('*').remove()
                svg.call(scatterPlot, {
                    data,
                    width,
                    height,
                    xValue,
                    xLabel,
                    yValue,
                    yLabel,
                    zValue: (d) => d.img,
                    title: "Does the average weather at home affect home team Win Percentage?",
                    margin: {
                        left: 75,
                        right: 50,
                        bottom: 75,
                        top: 100
                    }
                })
            } else if (state.line_select === "Line_Chart") {
                svg.selectAll('*').remove()
                svg.call(lineChart, {
                    data: data.sort(function (a, b) {
                        if (xValue(a) < xValue(b)) {
                            return -1
                        }
                        if (xValue(a) > xValue(b)) {
                            return 1
                        }
                        return 0
                    }),
                    width,
                    height,
                    xValue,
                    xLabel,
                    yValue,
                    yLabel,
                    zValue: (d) => d.img,
                    title: "Does the average weather at home affect home team Win Percentage?",
                    margin: {
                        left: 75,
                        right: 50,
                        bottom: 75,
                        top: 100
                    }
                })
            } else if (state.line_select === "Map") {
                svg.selectAll('*').remove()
                svg.call(map, {
                    width,
                    height,
                    xValue,
                    xLabel,
                    yValue,
                    yLabel,
                    zValue: (d) => d.img,
                    title: "Map of home team win percentage and climate regions",
                    data: map_data,
                    team_data: data
                })
            }

            //console.log(data)

        } else if (weather_data === undefined) {
            setState((state) => ({
                ...state,
                weather_data: 'LOADING',
                meta_data: 'LOADING',
                map_data: 'LOADING'
            }))

            fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
                .then((res) => res.json())
                .then(topoJSONdata => {
                    const map_data = topojson.feature(
                        topoJSONdata,
                        "states"
                    )
                    console.log(map_data)
                    setState((state) => ({
                        ...state,
                        map_data
                    }))
                })
                        

            fetch('https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/meta-data.json')
                .then((res) => res.json())
                .then((rawdata) => {

                    setState((state) => ({
                        ...state,
                        meta_data: rawdata
                    }))
                })

            fetch('https://raw.githubusercontent.com/hmkyriacou/scrape-nfl-data/main/weather_data.json')
                .then((res) => res.json())
                .then((rawdata) => {

                    setState((state) => ({
                        ...state,
                        weather_data: rawdata
                    }))
                })
        }


    };
