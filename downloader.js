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
    let sheet = [];
    console.log(jason);
    Object.entries(jason).forEach(([eventKey, eventStatus]) => {
        let array = [];

        array.push(`Event: ${eventKey}`);

        array.push(`<strong>Overall Status:</strong> ${eventStatus.overall_status_str}`);


        if (eventStatus.qual) {
            array.push(`<strong>Qualification Status:</strong> Rank ${eventStatus.qual.ranking.rank}/${eventStatus.qual.num_teams} with a record of ${eventStatus.qual.ranking.record.wins}-${eventStatus.qual.ranking.record.losses}-${eventStatus.qual.ranking.record.ties}`);
        }else{
            array.push("");
        }

        if (eventStatus.playoff) {
            array.push(`<strong>Playoff Status:</strong> ${eventStatus.playoff_status_str}`);
        }else{
            array.push("");
        }

        if (eventStatus.alliance) {
            array.push(`<strong>Alliance:</strong> ${eventStatus.alliance_status_str}`);
        }else{
            array.push("");
        }

        sheet.push(array);
    });
    
    console.log(sheet);
    downloadExcel(sheet);
}