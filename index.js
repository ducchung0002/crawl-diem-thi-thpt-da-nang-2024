const axios = require('axios');
const XLSX = require('xlsx');
// let fileStudent = [];

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
var content;

async function searching() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const batchSize = 100; // Adjust this based on memory constraints
    let batchData = [];
    let is_break = false;

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
                    batchData.push(studentData);
                    console.log("ADD", sbd);

                    if (batchData.length >= batchSize) {
                        // Append batch data to worksheet and write to file
                        XLSX.utils.sheet_add_json(worksheet, batchData, { origin: -1, skipHeader: true });
                        batchData = [];
                        XLSX.writeFile(workbook, "students.xlsx");
                    }
                }
            } catch (error) {
                console.error("ERROR AT", sbd);
                break;
            }
        }
    }

    // Write any remaining data to the file
    if (batchData.length > 0) {
        XLSX.utils.sheet_add_json(worksheet, batchData, { origin: -1, skipHeader: true });
        XLSX.writeFile(workbook, "students.xlsx");
    }

    console.log("Data has been written to students.xlsx");
}


function main() {
    searching();
}

main();