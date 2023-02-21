import { select, arc } from 'd3';
import { scatterPlot } from './scatterPlot'

const legend_height = 150
const height = window.innerHeight - legend_height;
const width = window.innerWidth;

const image_data = {
    "Pittsburgh": "https://www.clipartmax.com/png/middle/437-4378474_pittsburgh-steelers-logo-png-transparent-svg-vector-logo-pittsburgh-steelers-football.png",
    "Las Vegas": "https://i.pinimg.com/originals/a7/28/43/a72843045273fe5a3f308f77629bab01.png",
    "Kansas City": "https://logos-world.net/wp-content/uploads/2020/05/Kansas-City-Chiefs-logo.png",
    "Dallas": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/1076px-Dallas_Cowboys.svg.png",
    "Carolina": "https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CAR",
    "New Orleans": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/630px-New_Orleans_Saints_logo.svg.png",
    "Denver": "https://logos-world.net/wp-content/uploads/2020/05/Denver-Broncos-logo.png",
    "Washington": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Washington_Commanders_logo.svg/2560px-Washington_Commanders_logo.svg.png",
    "Cleveland": "https://1000logos.net/wp-content/uploads/2016/10/Cleveland-Browns-Logo-1986.png",
    "Detroit": "https://logos-world.net/wp-content/uploads/2020/05/Detroit-Lions-logo.png",
    "New England": "https://loodibee.com/wp-content/uploads/nfl-new-england-patriots-team-logo.png",
    "Miami": "https://1000logos.net/wp-content/uploads/2021/04/Miami-Dolphins-logo.png",
    "Buffalo": "https://loodibee.com/wp-content/uploads/nfl-buffalo-bills-team-logo.png",
    "Green Bay": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/2560px-Green_Bay_Packers_logo.svg.png",
    "San Francisco": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/2560px-San_Francisco_49ers_logo.svg.png",
    "Philadelphia": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Philadelphia_Eagles_wordmark.svg/2560px-Philadelphia_Eagles_wordmark.svg.png",
    "Indianapolis": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/974px-Indianapolis_Colts_logo.svg.png",
    "Seattle": "https://toppng.com/uploads/preview/19-beautiful-nfl-teams-logos-seattle-seahawks-logo-transparent-11563199254zonapfkvjz.png",
    "Baltimore": "https://logos-world.net/wp-content/uploads/2020/05/Baltimore-Ravens-logo.png",
    "Atlanta": "https://logos-world.net/wp-content/uploads/2020/05/Atlanta-Falcons-logo.png",
    "New York Giants": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/2560px-New_York_Giants_logo.svg.png",
    "New York Jets": "https://1000logos.net/wp-content/uploads/2017/03/New-York-Jets-Logo.png",
    "Tennessee": "https://1000logos.net/wp-content/uploads/2018/07/Tennessee-Titans-Logo.png",
    "Houston": "https://logos-world.net/wp-content/uploads/2020/05/Houston-Texans-logo.png",
    "Cincinnati": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/2560px-Cincinnati_Bengals_logo.svg.png",
    "Tampa Bay": "https://1000logos.net/wp-content/uploads/2016/10/Tampa-Bay-Buccaneers-logo.jpg",
    "Los Angeles Rams": "https://www.freepnglogos.com/uploads/rams-logo-png/los-angeles-rams-logo-png-2.png",
    "Los Angeles Chargers": "https://cdn.freebiesupply.com/images/large/2x/los-angeles-chargers-logo-transparent.png",
    "Chicago": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/2560px-Chicago_Bears_logo.svg.png",
    "Arizona": "https://1000logos.net/wp-content/uploads/2016/10/Arizona-Cardinals-Logo.png",
    "Jacksonville": "https://www.gannett-cdn.com/media/USATODAY/gameon/2013/02/05/0ap1000000136416-16_9.jpg?width=618&height=350&fit=crop&format=pjpg&auto=webp",
    "Minnesota": "https://1000logos.net/wp-content/uploads/2017/06/Minnesota-Vikings-Logo-1965.png"
}

function radio(selection, { name, l, handleChange }) {

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

}

export const viz = (container,
    { state, setState }) => {


    const legend = select(container)
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
    })


    const svg = select(container)
        .selectAll('svg.chart')
        .data([null])
        .join('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height)
        .attr("style", "border:1px solid black; box-sizing: border-box;")

    const { data, weather_data } = state

    if ((weather_data !== undefined && weather_data !== 'LOADING') && data === undefined) {
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



                            let team = game.split('_')[1]

                            if (team === "Washington Redskins" || team === "Washington Football Team") {
                                team = "Washington Commanders"
                            }

                            if (team === "Oakland Raiders") {
                                team = "Las Vegas Raiders"
                            }

                            if (team === "St. Louis Rams") {
                                team = "Los Angeles Rams"
                            }

                            if (team === "San Diego Chargers") {
                                team = "Los Angeles Chargers"
                            }

                            const city = team.substring(0, team.lastIndexOf(" "))

                            if (teamsObj[team]) {
                                teamsObj[team].push(rawdata[year][week][game])
                            } else {
                                teamsObj[team] = [rawdata[year][week][game]]
                            }

                            teamsObj[team].city = city

                        }
                    }

                }

                for (let team in teamsObj) {


                    let winPct = teamsObj[team].map((o) => {
                        if (o.home_score > o.away_score) {
                            return 1
                        } else {
                            return 0
                        }
                    })

                    winPct = winPct.reduce((p, c) => p + c, 0) / winPct.length

                    teamsObj[team].winPct = winPct

                }


                for (let team in teamsObj) {
                    //console.log(weather_data[teamsObj[team].city], teamsObj[team].city)
                    teamsObj[team].temp = weather_data[teamsObj[team].city].map((m) => {
                        return m['MLY-AVG-TEMP']
                    }).reduce((p, c) => p + c, 0) / 12
                    //console.log(teamsObj[team].temp)
                    teamsObj[team].img = image_data[teamsObj[team].city] || image_data[team]

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

        svg.call(scatterPlot, {
            data,
            width,
            height,
            xValue: (d) => d.winPct,
            xLabel: "Home Field Win Percentage",
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

        //console.log(data)

    } else if (weather_data === undefined) {
        setState((state) => ({
            ...state,
            weather_data: 'LOADING'
        }))

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
