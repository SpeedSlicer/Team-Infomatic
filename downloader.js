function downloadExcel(json){
    let data = json;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
     XLSX.utils.sheet_add_aoa(worksheet, [["one","two","three","four"]], { origin: "A1" });

    XLSX.utils.book_append_sheet(workbook, worksheet, "selection");
    XLSX.writeFile(workbook, "test"+".xlsx", { compression: false });

    // const blob = new Blob([workbook], { type: 'text/plain' });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = currentTable.name+"_selection.xlsx"; //name of file to download
    // document.body.appendChild(a); //necessary on some browsers to make it clickable
    // a.click();
    // document.body.removeChild(a); //keep DOM structure clean
    // window.URL.revokeObjectURL(url); //free up memory
}

function testDownload() {
    //let json = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
    console.log(jason);
    Object.entries(jason).forEach(([eventKey, eventStatus]) => {
        const container = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = `Event: ${eventKey}`;
        container.appendChild(title);

        const overallStatus = document.createElement('p');
        overallStatus.innerHTML = `<strong>Overall Status:</strong> ${eventStatus.overall_status_str}`;
        container.appendChild(overallStatus);

        if (eventStatus.qual) {
            const qualStatus = document.createElement('p');
            qualStatus.innerHTML = `<strong>Qualification Status:</strong> Rank ${eventStatus.qual.ranking.rank}/${eventStatus.qual.num_teams} with a record of ${eventStatus.qual.ranking.record.wins}-${eventStatus.qual.ranking.record.losses}-${eventStatus.qual.ranking.record.ties}`;
            container.appendChild(qualStatus);
        }

        if (eventStatus.playoff) {
            const playoffStatus = document.createElement('p');
            playoffStatus.innerHTML = `<strong>Playoff Status:</strong> ${eventStatus.playoff_status_str}`;
            container.appendChild(playoffStatus);
        }

        if (eventStatus.alliance) {
            const allianceStatus = document.createElement('p');
            allianceStatus.innerHTML = `<strong>Alliance:</strong> ${eventStatus.alliance_status_str}`;
            container.appendChild(allianceStatus);
        }

        document.body.appendChild(container);
    });
    //downloadExcel(jason);
}