function getData(team) {
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
      const container = document.getElementById("info");
      container.innerHTML = "";
      Object.entries(data).forEach(([eventKey, eventStatus]) => {
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
    })
    .catch((error) => console.error("Error:", error));
}
