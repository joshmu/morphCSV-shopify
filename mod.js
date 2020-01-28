const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv').parse;
const csvFilePath = process.argv[2];
const csv = require('csvtojson');

(async () => {


    // Async / await usage
    data = await csv().fromFile(csvFilePath);

    // ADD DETAILS TO ALL ORDERS
    for (let i = 0; i < data.length; i++) {
        let order = data[i]
        let prevOrder = data[i - 1]

        if (!order['Shipping Name'].length && order['Name'] === prevOrder['Name']) {
            console.log(`${i}:${order['Name']} - requires info`)
            //console.log(`${i - 1}:${prevOrder['Name']} - used`)

            // fill in details required which would exist on the prev order line
            order['Shipping Name'] = prevOrder['Shipping Name']
            order['Shipping Street'] = prevOrder['Shipping Street']
            order['Shipping Address1'] = prevOrder['Shipping Address1']
            order['Shipping Address2'] = prevOrder['Shipping Address2']
            order['Shipping Company'] = prevOrder['Shipping Company']
            order['Shipping City'] = prevOrder['Shipping City']
            order['Shipping Zip'] = prevOrder['Shipping Zip']
            order['Shipping Province'] = prevOrder['Shipping Province']
            order['Shipping Country'] = prevOrder['Shipping Country']
            order['Financial Status'] = prevOrder['Financial Status']
            order['Fulfillment Status'] = prevOrder['Fulfillment Status']
            order['Risk Level'] = prevOrder['Risk Level']
        }
    }

    // REQUIREMENTS
    data = data.filter(d => {
        return d['Financial Status'] === 'paid' && d['Lineitem fulfillment status'] === 'pending' && d['Vendor'] === 'FANHHUI';
        // original version with payment 'Risk Level'
        // return d['Financial Status'] === 'paid' && d['Fulfillment Status'] === 'unfulfilled' && d['Risk Level'] === 'Low' && d['Vendor'] === 'FANHHUI';
    });


    // OUTPUT
    let output = data.map(d => {
        return { Name: d['Name'],
            // Email: d['Email'],
            'Created at': d['Created at'],
            'Lineitem quantity': d['Lineitem quantity'],
            'Lineitem name': d['Lineitem name'],
            'Lineitem sku': d['Lineitem sku'],
            'Shipping Name': d['Shipping Name'],
            'Shipping Street': d['Shipping Street'],
            'Shipping Address1': d['Shipping Address1'],
            'Shipping Address2': d['Shipping Address2'],
            'Shipping Company': d['Shipping Company'],
            'Shipping City': d['Shipping City'],
            'Shipping Zip': d['Shipping Zip'],
            'Shipping Province': d['Shipping Province'],
            'Shipping Country': d['Shipping Country'],
            'TRACKING_COMPANY': '',
            'TRACKING_NUMBER': '',
            'PRICE': '',
            'TRACKING_URL': ''
        }
    })

    // just show the modded orders for proof
    console.log('changed entries...')
    output.forEach(d => {
        if (d['Name'] === '#4061' || d['Name'] === '#4041') console.log(d)
    })

    // SAVE
    let csvKeys = Object.keys(output[0])

    const fields = csvKeys
    const opts = { fields }
    try {
        const csv = json2csv(output, opts);
        //console.log(csv);
        fs.writeFileSync(path.join(process.cwd(),`mod-${process.argv[2]}`), csv)
    } catch (err) {
        console.error(err);
    }

    console.log('done')
})()

