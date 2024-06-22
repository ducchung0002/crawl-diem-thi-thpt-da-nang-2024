const axios = require('axios');
const fs = require('fs');

async function searching() {
    const config = {
        method: 'get',
        url: 'https://tracuudiem.danang.gov.vn:8443/tracuu/public/diemthi',
        headers: {
            'X-APP-CODE': 'e1d062d8bb2e38757c8e7c7c9ed3dc28',
        },
        params: {
            cot1: '',
            kyThiId: 104
        }
    };

    let content;
    let students = [];

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
            } catch (error) {
                console.error("ERROR AT", sbd);
                break;
            }
        }
    }

    const csvContent = students.map(student => Object.values(student).join(',')).join('\n');
    const csvHeader = Object.keys(students[0]).join(',') + '\n';
    fs.writeFile('diem_thi_da_nang.csv', csvHeader + csvContent, 'utf8', function (err) {
        if (err) {
            console.log('Some error occurred - file either not saved or corrupted file saved.');
        } else{
            console.log('Data has been written to diem_thi_da_nang.csv');
        }
    });
}

function main() {
    searching();
}

main();