let events = [];
var cookie = {
  set: function (name, value, daysToLive) {
    var cookie = name + "=" + encodeURIComponent(value);

    if (typeof daysToLive === "number") {
      cookie += "; max-age=" + daysToLive * 24 * 60 * 60;
    }

    document.cookie = cookie;
  },

  get: function (name) {
    var cookies = document.cookie.split(";").map(function (cookie) {
      return cookie.trim();
    });

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var separatorIndex = cookie.indexOf("=");
      var cookieName = cookie.slice(0, separatorIndex);

      if (cookieName === name) {
        return decodeURIComponent(cookie.slice(separatorIndex + 1));
      }
    }

    return null;
  },

  delete: function (name) {
    document.cookie = name + "=; max-age=0";
  },

  exists: function (name) {
    var cookies = document.cookie.split(";").map(function (cookie) {
      return cookie.trim();
    });

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var separatorIndex = cookie.indexOf("=");
      var cookieName = cookie.slice(0, separatorIndex).trim();

      if (cookieName === name) {
        return true;
      }
    }

    return false;
  },
};
let authKey = cookie.get("authKey") || "";

function getGeneralData(team) {
  if (authKey == "") {
    authKey =
      "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13";
  }
  events = [];
  team = "frc" + team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/events/${year}/statuses`;
  const cookies = document.cookie.split("; ");
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": authKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("info-gen");
      container.innerHTML = "";
      Object.entries(data).forEach(([eventKey, eventStatus]) => {
        events.push(eventKey);
        const title = document.createElement("h3");
        title.textContent = `Event: ${eventKey}`;
        container.appendChild(title);

        const overallStatus = document.createElement("p");
        overallStatus.innerHTML = `<strong>Overall Status:</strong> ${eventStatus.overall_status_str}`;
        container.appendChild(overallStatus);

        if (eventStatus.qual) {
          const qualStatus = document.createElement("p");
          qualStatus.innerHTML = `<strong>Qualification Status:</strong> Rank ${eventStatus.qual.ranking.rank}/${eventStatus.qual.num_teams} with a record of ${eventStatus.qual.ranking.record.wins}-${eventStatus.qual.ranking.record.losses}-${eventStatus.qual.ranking.record.ties}`;
          container.appendChild(qualStatus);
        }

        if (eventStatus.playoff) {
          const playoffStatus = document.createElement("p");
          playoffStatus.innerHTML = `<strong>Playoff Status:</strong> ${eventStatus.playoff_status_str}`;
          container.appendChild(playoffStatus);
        }

        if (eventStatus.alliance) {
          const allianceStatus = document.createElement("p");
          allianceStatus.innerHTML = `<strong>Alliance:</strong> ${eventStatus.alliance_status_str}`;
          container.appendChild(allianceStatus);
        }

        document.body.appendChild(container);
      });
      const eventsP = document.createElement("p");
      eventsP.textContent = "Events: " + events.join(", ");
      container.appendChild(eventsP);
    })
    .catch((error) => console.error("Error:", error));
}
function getSpecificData(team) {
  if (authKey == "") {
    authKey =
      "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13";
  }
  const containerMain = document.getElementById("info-container-spec");
  events = [];
  team = "frc" + team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/events/${year}/statuses`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": authKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("info-container-spec");
      container.innerHTML = "";
      Object.entries(data).forEach(([eventKey, eventStatus]) => {
        events.push(eventKey);
        button = document.createElement("button");
        button.innerHTML = `View Details for ${eventKey}`;
        button.onclick = () => infoSpec(team, eventKey);
        container.appendChild(button);
      });
      const eventsP = document.createElement("p");
      eventsP.textContent = "Events: " + events.join(", ");
      container.appendChild(eventsP);
    })
    .catch((error) => console.error("Error:", error));
}

function infoSpec(team, event) {
  if (authKey == "") {
    authKey =
      "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13";
  }
  team = team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/event/${event}/matches`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key": authKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("info-spec");
      const containerOverview = document.getElementById("info-spec-overview");
      containerOverview.innerHTML = "";
      container.innerHTML = "";
      let totalPoints = 0;
      let totalRP = 0;
      let matchCount = 0;
      if (Array.isArray(data)) {
        data.forEach((match) => {
          try {
            if (match.alliances.red.team_keys.includes(team)) {
              totalPoints += match.alliances.red.score;
              totalRP += match.score_breakdown.red.rp;
            } else if (
              match.alliances.blue.team_keys.includes(team) &&
              match.score_breakdown.blue.rp != null
            ) {
              totalPoints += match.alliances.blue.score;
              totalRP += match.score_breakdown.blue.rp;
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
      if (Array.isArray(data)) {
        data.forEach((match) => {
          const matchDetails = document.createElement("div");
          let redScore;
          let blueScore;
          try {
            redScore = match.alliances.red.score;
            blueScore = match.alliances.blue.score;
            if ((redScore = -1)) {
              redScore = "TBD";
            }
            if ((blueScore = -1)) {
              blueScore = "TBD";
            }
          } catch (e) {
            redScore = "TBD";
            blue = "TBD";
          }
          matchDetails.innerHTML = `
                <h4>Match: ${match.comp_level} ${match.match_number}</h4>
                <p><strong>Red Alliance:</strong> ${match.alliances.red.team_keys.join(
                  ", "
                )} | Score: ${redScore}</p>
                <p><strong>Blue Alliance:</strong> ${match.alliances.blue.team_keys.join(
                  ", "
                )} | Score: ${blueScore}</p>
                <p><strong>Winning Alliance:</strong> ${
                  match.winning_alliance
                }</p>
            `;
          matchCount++;

          container.appendChild(matchDetails);
        });
        const avgPoints = totalPoints / matchCount;
        const avgPointsDisplay = document.createElement("h3");
        avgPointsDisplay.textContent = `Average Points per Match: ${avgPoints.toFixed(
          2
        )}`;
        const matchDisplay = document.createElement("h3");
        matchDisplay.textContent = `Matches played: ${matchCount}`;
        const rpDisplay = document.createElement("h3");
        rpDisplay.textContent = `Ranking Points: ${totalRP}`;
        const avgRpDisplay = document.createElement("h3");
        avgRpDisplay.textContent = `Average Ranking Points: ${
          totalRP / matchCount
        }`;
        containerOverview.appendChild(rpDisplay);
        containerOverview.appendChild(avgRpDisplay);
        containerOverview.appendChild(matchDisplay);
        containerOverview.prepend(avgPointsDisplay);
        document.body.appendChild(containerOverview);

        document.body.appendChild(container);
      }
    })
    .catch((error) => console.error("Error:", error));
}
