function downloadCSV (sheet){
    let content = "";
    for(let i=0; i<sheet.length; i++){
        for(let j=0; j<sheet[0].length; j++){
            content += sheet[i][j]+",";
        }
        content += "\n";
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "test"+"_selection.csv"; //name of file to download
    document.body.appendChild(a); //necessary on some browsers to make it clickable
    a.click();
    document.body.removeChild(a); //keep DOM structure clean
    window.URL.revokeObjectURL(url); //free up memory
}

let data;
let data2;
let data3;

function testDownload() {

    // columns 
    // Team number (identifier)
    // Rank
    // Avg RP
    // Matches played
    // Total RP (round(avg RP*matches played)
    // columns for each match remaining

    // rows
    // unique team


const url = `https://www.thebluealliance.com/api/v3/event/2025njtab/matches`;
const url2 = `https://www.thebluealliance.com/api/v3/event/2025njtab/rankings`; // satisfies 1-5

fetch(url, {
    method: "GET",
    headers: {
        "X-TBA-Auth-Key":
            "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
    },
}).then((response) => response.json()).then((json) => {data = json;
}).then(fetch(url2, {
    method: "GET",
    headers: {
        "X-TBA-Auth-Key":
            "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
    },
}).then((response) => response.json()).then((json) => {data2 = json;
})).then(
    () => {
    console.log(data);
    console.log(data2);
    downloadCSV(construct_sheet())
    }
);
    
}

function getMatch(teamNumber){
    fetch(`https://www.thebluealliance.com/api/v3/team/frc`+teamNumber+`/event/2025njtab/matches`, {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key":
                "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
        },
    }).then((response) => response.json()).then((json) => {data3 = json;
    });
}

//data and data2 must be initialized
function construct_sheet(){
    let sheet = [];
    let numQualMatches = 0;
    let unplayedMatches = [];
    for(let i=0; i<data.length; i++){
        if(data[i].comp_level = "qm"){
            numQualMatches++;
        }
        if(data[i].winning_alliance == null){
            unplayedMatches.push(data[i].match_number);
        }
    }
    let currentMatch = Math.min(unplayedMatches);
    let titleRow = [
        "Team Number",
        "Rank",
        "Average Ranking Points",
        "Matches Played",
        "Total Ranking Points"
    ]
    for(let i=currentMatch; i<numQualMatches; i++){
        titleRow.push(i);
    }
    sheet.push(titleRow);

    for(let t=0; t<data2.rankings.length; t++){

        let teamData = data2.rankings[t];
        let teamNumber = teamData.team_key.slice(3);
        let rank = teamData.rank;
        let totalRP = teamData.extra_stats[teamData.extra_stats.length-1];
        let matchesPlayed = teamData.matches_played;
        let avgRP = totalRP/matchesPlayed;

        let row = [teamNumber, rank, avgRP, matchesPlayed, totalRP];

        //fetch data3 from API
        getMatch(teamNumber);

        let qualMatches = new Array(numQualMatches-currentMatch);
        for(let i=0; i<data3.length; i++){
            if(data3[i].comp_level == "qm"){
                if(data3[i].match_number - currentMatch >= 0){
                    qualMatches[data3[i].match_number - currentMatch] = "X";
                }
            }
        }
        row.push(qualMatches);
        sheet.push(row);
    }
    return sheet;
}


