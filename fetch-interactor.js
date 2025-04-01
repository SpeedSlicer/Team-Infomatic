let events = [];
function getGeneralData(team) {
  events = [];
  team = "frc" + team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/events/${year}/statuses`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key":
        "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
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
  const containerMain = document.getElementById("info-container-spec");
  events = [];
  team = "frc" + team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/events/${year}/statuses`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key":
        "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
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
  team = team;
  year = 2025;
  const url = `https://www.thebluealliance.com/api/v3/team/${team}/event/${event}/matches`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-TBA-Auth-Key":
        "1zgMOfk62T2yqFlC2qEgsp1BAVDmLlKiNJcfKG5ZPlFkBCXvAAwvx3vRHB1ahJ13",
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
          if (match.alliances.red.team_keys.includes(team)) {
            totalPoints += match.alliances.red.score;
          } else if (match.alliances.blue.team_keys.includes(team)) {
            totalPoints += match.alliances.blue.score;
          }
        });
      }
      if (Array.isArray(data)) {
        data.forEach((match) => {
          const matchDetails = document.createElement("div");
          matchDetails.innerHTML = `
                <h4>Match: ${match.comp_level} ${match.match_number}</h4>
                <p><strong>Red Alliance:</strong> ${match.alliances.red.team_keys.join(
                  ", "
                )} | Score: ${match.alliances.red.score}</p>
                <p><strong>Blue Alliance:</strong> ${match.alliances.blue.team_keys.join(
                  ", "
                )} | Score: ${match.alliances.blue.score}</p>
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
        containerOverview.prepend(avgPointsDisplay);
        document.body.appendChild(containerOverview);

        document.body.appendChild(container);
      }
    })
    .catch((error) => console.error("Error:", error));
}
