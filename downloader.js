function downloadCSV(sheet) {
    let content = "";
    for (let i = 0; i < sheet.length; i++) {
        for (let j = 0; j < sheet[0].length; j++) {
            content += sheet[i][j] + ",";
        }
        content += "\n";
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "test" + "_selection.csv"; //name of file to download
    document.body.appendChild(a); //necessary on some browsers to make it clickable
    a.click();
    document.body.removeChild(a); //keep DOM structure clean
    window.URL.revokeObjectURL(url); //free up memory
}

let data; //
let data2; //
let data3 = new Map(); //
let eventName = "2025njtab"; // default value

async function downloadClicked() {
    if (authKey == "") {
        alert("Set authkey in settings! Get one at the TBA API Site!");
        window.location.href = ("settings.html");
    }
    // columns 
    // Team number (identifier)
    // Rank
    // Avg RP
    // Matches played
    // Total RP (round(avg RP*matches played)
    // columns for each match remaining

    // rows
    // unique team

    input = document.getElementById("event-input").value;
    if (input && input != "") {// null check
        eventName = input;
    }


    const url = `https://www.thebluealliance.com/api/v3/event/` + eventName + `/matches`;
    const url2 = `https://www.thebluealliance.com/api/v3/event/` + eventName + `/rankings`; // satisfies 1-5

    await fetch(url, {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key":
                authKey,
        },
    }).then((response) => response.json()).then((json) => {
        data = json;
    });

    await fetch(url2, {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key":
                authKey,
        },
    }).then((response) => response.json()).then((json) => {
        data2 = json;
    });

    console.log(data);
    console.log(data2);

    data3 = await getAllMatches();

    console.log(data3);

    downloadCSV(construct_sheet());

}
async function downloadClickedTeam(team) {
    if (authKey == "") {
        alert("Set authkey in settings! Get one at the TBA API Site!");
        window.location.href = ("settings.html");
    }

    team = "frc" + team;
    const year = 2025;
    const urlx = `https://www.thebluealliance.com/api/v3/team/${team}/events/${year}/statuses`;

    let events = [];
    let csvContent = "Event Key,Match Level,Match Number,Red Alliance,Red Score,Blue Alliance,Blue Score,Winning Alliance\n";

    await fetch(urlx, {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key": authKey,
        },
    })
        .then((response) => response.json())
        .then(async (data) => {
            for (const [eventKey, eventStatus] of Object.entries(data)) {
                events.push(eventKey);
                const matchesUrl = `https://www.thebluealliance.com/api/v3/team/${team}/event/${eventKey}/matches`;

                await fetch(matchesUrl, {
                    method: "GET",
                    headers: {
                        "X-TBA-Auth-Key": authKey,
                    },
                })
                    .then((response) => response.json())
                    .then((matches) => {
                        if (Array.isArray(matches)) {
                            if (eventStatus) {
                                const qual = eventStatus.qual || {};
                                const alliance = eventStatus.alliance || {};
                                const playoff = eventStatus.playoff || {};
                                csvContent += `\n  `;
                                csvContent += `Event Overview For ${eventKey}: \n`;
                                csvContent += `Qual Num Teams: ${qual.num_teams}\n`;
                                csvContent += `Qual Matches Played: ${qual.ranking?.matches_played}\n`;
                                csvContent += `Qual Rank: ${qual.ranking?.rank}\n`;
                                csvContent += `Alliance Name: ${alliance.name}\n`;
                                csvContent += `Alliance Number: ${alliance.number}\n`;
                                csvContent += `Playoff Level: ${playoff.level}\n`;
                                csvContent += `Playoff Status: ${playoff.status}\n`;
                                csvContent += `Overall Status: ${eventStatus.overall_status_str}\n`;
                            }
                            matches.forEach((match) => {
                                const redAlliance = match.alliances.red.team_keys.join(" ");
                                const blueAlliance = match.alliances.blue.team_keys.join(" ");
                                const redScore = match.alliances.red.score;
                                const blueScore = match.alliances.blue.score;
                                const winningAlliance = match.winning_alliance;

                                csvContent += `${eventKey},${match.comp_level},${match.match_number},"${redAlliance}",${redScore},"${blueAlliance}",${blueScore},${winningAlliance}\n`;
                            });
                        }

                    });
            }
        }).catch((error) => console.error("Error:", error));
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${team}_matches.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};





//data2 must be initialized
async function getAllMatches() {
    //return a map with key: teamNumber and value: array of all scheduled matches
    let numQualMatches = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].comp_level === "qm") {
            numQualMatches++;
        }
    }

    try {
        let urls = [];
        for (let t = 0; t < data2.rankings.length; t++) {
            //data2.rankings[t].team_key
            urls.push(`https://www.thebluealliance.com/api/v3/team/` + data2.rankings[t].team_key + `/event/` + eventName + `/matches`);
        }

        // Fire all API calls at the same time
        const responses = await Promise.all(urls.map(url => fetch(url, {
            method: "GET",
            headers: {
                "X-TBA-Auth-Key":
                    authKey,
            },
        })));
        // Convert all responses to JSON
        const data = await Promise.all(responses.map(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        }));
        let map_teamNum_matches = new Map();
        for (let i = 0; i < data.length; i++) {
            let matches = new Array(numQualMatches).fill('');
            let teamNum = data2.rankings[i].team_key.slice(3);
            for (let j = 0; j < data[i].length; j++) {
                let match = data[i][j];
                if (match && match.comp_level === "qm") {
                    matches[match.match_number] = "X";
                }
            }
            map_teamNum_matches.set(teamNum, matches);
        }
        return map_teamNum_matches;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


//data and data2 must be initialized
function construct_sheet() {
    let sheet = [];
    let titleRow = [
        "Team Number",
        "Rank",
        "Average Ranking Points",
        "Matches Played",
        "Total Ranking Points"
    ]
    let numQualMatches = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].comp_level = "qm") {
            numQualMatches++;
        }
    }
    for (let i = 0; i < numQualMatches; i++) {
        titleRow.push(i);
    }
    sheet.push(titleRow);

    for (let t = 0; t < data2.rankings.length; t++) {

        let teamData = data2.rankings[t];
        let teamNumber = teamData.team_key.slice(3);
        let rank = teamData.rank;
        let totalRP = teamData.extra_stats[teamData.extra_stats.length - 1];
        let matchesPlayed = teamData.matches_played;
        let avgRP = totalRP / matchesPlayed;

        sheet.push([teamNumber, rank, avgRP, matchesPlayed, totalRP].concat(data3.get(teamNumber)));
    }
    return sheet;
}


