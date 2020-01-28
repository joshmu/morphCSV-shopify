const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv').parse;
const csvFilePath = process.argv[2];
const csv = require('csvtojson');

(async () => {


    // Async / await usage
    let data = await csv().fromFile(csvFilePath);
    //console.log(data)

    for (let i = 0; i < data.length; i++) {
        let d = data[i]
        if (d['TRACKING_NUMBER'].length > 0) {
            if (d['TRACKING_COMPANY'].match(/royal/i) || d['TRACKING_COMPANY'].match(/rodel/i)) {
                d['TRACKING_URL'] = `http://track.4px.com/query/${d['TRACKING_NUMBER']}?`
            } else if (d['TRACKING_COMPANY'].match(/fedex/i)) {
                d['TRACKING_URL'] = `https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=${d['TRACKING_NUMBER']}&cntry_code=us&locale=en_US`
            } else {
                // DEFAULT TRACKING URL
               d['TRACKING_URL'] = 'https://t.17track.net/en#nums=' + d['TRACKING_NUMBER']
               // d['TRACKING_URL'] = `http://track.4px.com/query/${d['TRACKING_NUMBER']}?`
            }
        }
    }

    // SAVE
    let csvKeys = Object.keys(data[0])

    const fields = csvKeys
    const opts = { fields }
    try {
        const csv = json2csv(data, opts);
        //console.log(csv);
        fs.writeFileSync(path.join(process.cwd(),`trk-${process.argv[2]}`), csv)
    } catch (err) {
        console.error(err);
    }

    console.log('done')
})()

