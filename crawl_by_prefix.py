import sys
import requests
import pandas as pd

def searching(prefix):
    config = {
        'method': 'get',
        'url': 'https://tracuudiem.danang.gov.vn:8443/tracuu/public/diemthi',
        'headers': {
            'X-APP-CODE': 'e1d062d8bb2e38757c8e7c7c9ed3dc28',
        },
        'params': {
            'cot1': '',
            'kyThiId': 104
        }
    }

    students = []

    for i in range(1, 10000):
        suffix = str(i).zfill(4)
        sbd = str(prefix).zfill(2) + suffix

        config['params']['cot1'] = sbd

        try:
            response = requests.get(config['url'], headers=config['headers'], params=config['params'])
            content = response.json()['content'][0]

            if content is None:
                print("STOP AT", sbd)
                break
            else:
                student_data = {
                    'SO_BAO_DANH': content['cot1'],
                    'HO_VA_TEN': content['cot2'],
                    'NGU_VAN': content['cot3'],
                    'NGOAI_NGU': content['cot4'],
                    'TOAN': content['cot5'],
                    'DIEM_XET_TUYEN': content['cot6']
                }
                students.append(student_data)
                print("ADD", sbd)
        except Exception as e:
            print("ERROR AT", sbd)
            break

    df = pd.DataFrame(students)
    df.to_csv(f'{prefix}.csv', index=False)


if __name__ == '__main__':
    searching(int(sys.argv[1]))

