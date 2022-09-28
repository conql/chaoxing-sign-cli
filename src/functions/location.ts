import { fail, rejects } from 'assert';
import https from 'https';
import { CHAT_GROUP, PPTSIGN, PRESIGN } from '../configs/api';

export const LocationSign = async (uf: string, _d: string, vc3: string, name: string, address: string, activeId: string | number, uid: string, lat: string, lon: string, fid: string): Promise<string> => {
  let data = ''
  return new Promise((resolve) => {
    https.get(PPTSIGN.URL + `?name=${name}&address=${address}&activeId=${activeId}&uid=${uid}&clientip=&latitude=${lat}&longitude=${lon}&fid=${fid}&appType=15&ifTiJiao=1`, {
      headers: {
        'Cookie': `uf=${uf}; _d=${_d}; UID=${uid}; vc3=${vc3};`
      }
    }, (res) => {
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (data === 'success') {
          console.log(`[位置]签到成功`)
          resolve('success')
        } else {
          console.log(data)
          resolve(data)
        }
      })
    })
  })
}

/**
 * 位置签到，无课程群聊版本
 */
export const LocationSign_2 = (uf: string, _d: string, vc3: string, address: string, activeId: string | number, uid: string, lat: string, lon: string): Promise<string> => {
  let data = ''
  return new Promise((resolve) => {
    let post = https.request(CHAT_GROUP.SIGN.URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': `uf=${uf}; _d=${_d}; UID=${uid}; vc3=${vc3};`
      }
    }, (res) => {
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (data === 'success') {
          console.log(`[位置]签到成功`)
          resolve('success')
        } else {
          console.log(data)
          resolve(data)
        }
      })
    })
    let formdata = `address=${encodeURIComponent(address)}&activeId=${activeId}&uid=${uid}&clientip=&useragent=&latitude=${lat}&longitude=${lon}&fid=&ifTiJiao=1`;
    post.write(formdata);
    post.end();
  })
}

type location = {
  address: string,
  lat: string,
  lon: string
}
export const GetTargetLocation = async (uf: string, _d: string, vc3: string, activeId: string | number, classId: string, courseId: string, uid: string) => {
  let data = ''
  return new Promise<location>((resolve, reject) => {
    https.get(PRESIGN.URL + `?courseId=${courseId}&classId=${classId}&activePrimaryId=${activeId}&general=1&sys=1&ls=1&appType=15&uid=${uid}&isTeacherViewOpen=0`, {
      headers: {
        'Cookie': `uf=${uf}; _d=${_d}; UID=${uid}; vc3=${vc3};`
      }
    }, (res) => {
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let result: location = {
          address: (data.match(/"locationText" value="(.*?)"/) ?? [])[1],
          lat: (data.match(/"locationLatitude" value="(.*?)"/) ?? [])[1],
          lon: (data.match(/"locationLongitude" value="(.*?)"/) ?? [])[1]
        }
        // check if the location is valid
        if (result.address && result.lat && result.lon) {
          console.log(`[位置]获取目标位置成功`)
          console.log(result)
          resolve(result)
        }
        else {
          console.log(`[位置]获取目标位置失败`)
          reject()
        }
      })
    })
  })
}
