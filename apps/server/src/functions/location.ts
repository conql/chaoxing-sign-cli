import { CHAT_GROUP, PPTSIGN, PRESIGN } from '../configs/api';
import { cookieSerialize, request } from '../utils/request';

export const LocationSign = async (
  args: BasicCookie & { name: string; address: string; activeId: string; lat: string; lon: string; fid: string }
): Promise<string> => {
  const { name, address, activeId, lat, lon, fid, ...cookies } = args;
  const url = `${PPTSIGN.URL}?name=${name}&address=${address}&activeId=${activeId}&uid=${cookies._uid}&clientip=&latitude=${lat}&longitude=${lon}&fid=${fid}&appType=15&ifTiJiao=1`;
  const result = await request(url, {
    secure: true,
    headers: {
      Cookie: cookieSerialize(cookies),
    },
  });
  if (result.data === 'success') {
    console.log(`[位置]签到成功`);
    return 'success';
  }
  console.log(result.data);
  return result.data;
};

/**
 * 位置签到，无课程群聊版本
 */
export const LocationSign_2 = async (
  args: BasicCookie & { name: string; address: string; activeId: string; lat: string; lon: string; fid: string }
): Promise<string> => {
  const { name, address, activeId, lat, lon, fid, ...cookies } = args;
  let formdata = `address=${encodeURIComponent(address)}&activeId=${activeId}&uid=${
    cookies._uid
  }&clientip=&useragent=&latitude=${lat}&longitude=${lon}&fid=&ifTiJiao=1`;
  const result = await request(
    CHAT_GROUP.SIGN.URL,
    {
      secure: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: cookieSerialize(cookies),
      },
    },
    formdata
  );
  if (result.data === 'success') {
    console.log(`[位置]签到成功`);
    return 'success';
  }
  console.log(result.data);
  return result.data;
};


type locationData = {
  address: string,
  lat: string,
  lon: string
}
export const GetTargetLocation = async (
  args: BasicCookie & { activeId: string | number, classId: string, courseId: string }
): Promise<locationData | null> => {
  const { activeId, classId, courseId, ...cookies } = args
  const url = `${PRESIGN.URL}?courseId=${courseId}&classId=${classId}&activePrimaryId=${activeId}&general=1&sys=1&ls=1&appType=15&uid=${cookies._uid}&isTeacherViewOpen=0`;
  const result = await request(url, {
    secure: true,
    headers: {
      Cookie: cookieSerialize(cookies)
    }
  }).then(res => res.data);

  let loc: locationData = {
    address: (
      result.match(/"locationText" value="(.*?)"/)
      ?? result.match(/<h2 id="address">(.*?)<\/h2>/)
      ?? [])[1],
    lon: (
      result.match(/"locationLongitude" value="(.*?)"/)
      ?? result.match(/id="longitude" value="(.*?)"/)
      ?? [])[1],
    lat: (
      result.match(/"locationLatitude" value="(.*?)"/)
      ?? result.match(/id="latitude" value="(.*?)"/)
      ?? [])[1]
  }

  // check if the location is valid
  if (loc.address && loc.lat && loc.lon) {
    console.log(`[位置]获取目标位置成功：${loc.address} (${loc.lon},${loc.lat})`)
    return loc
  }
  else {
    console.log(`[位置]获取目标位置失败`)
    console.log(result)
    return null
  }
}
