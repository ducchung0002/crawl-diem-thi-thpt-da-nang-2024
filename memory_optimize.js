const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');

async function searching() {
    const config = {
        method: 'get',
        url: 'https://tracuudiem.danang.gov.vn:8443/tracuu/public/diemthi',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'X-APP-CODE': 'e1d062d8bb2e38757c8e7c7c9ed3dc28',
            'Origin': 'https://tracuudiem.danang.gov.vn',
            'Connection': 'keep-alive',
            'Referer': 'https://tracuudiem.danang.gov.vn/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'Priority': 'u=1'
        },
        params: {
            capt: 'PP39',
            cot1: '',
            cot2: '',
            cot3: '',
            cot4: '',
            cot5: '',
            cot6: '',
            cot7: '',
            page: 0,
            size: 3,
            kyThiId: 104
        }
    };

    let content;
    let students = [];
    let batchSize = 100; // Define your batch size here
    let batchNumber = 1;

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream(`batch_${batchSize}.csv`);

    writableStream.on("finish", function(){
        console.log("DONE!");
    });

    csvStream.pipe(writableStream);

    for (let prefix = 1; prefix <= 9; prefix++) {
        for (let i = 1; i <= 9999; i++) {
            let suffix = i.toString().padStart(4, '0');
            let sbd = prefix.toString().padStart(2, '0') + suffix;

            config.params.cot1 = sbd;

            try {
                const response = await axios(config);
                content = response.data.content[0];

                if (content === undefined) {
                    console.log("STOP AT", sbd);
                    break;
                } else {
                    const studentData = {
                        SO_BAO_DANH: content.cot1,
                        HO_VA_TEN: content.cot2,
                        NGU_VAN: content.cot3,
                        NGOAI_NGU: content.cot4,
                        TOAN: content.cot5,
                        DIEM_XET_TUYEN: content.cot6
                    };
                    students.push(studentData);
                    console.log("ADD", sbd);
                }

                // If students array size reaches batch size, write to file
                if (students.length === batchSize) {
                    students.forEach(student => csvStream.write(student));
                    students = []; // Clear the students array
                }
            } catch (error) {
                console.error("ERROR AT", sbd);
                break;
            }
        }
    }

    // Write remaining students data to file
    if (students.length > 0) {
        students.forEach(student => csvStream.write(student));
    }

    csvStream.end();
    console.log("Data has been written to CSV files");
}

function main() {
    searching();
}

main();