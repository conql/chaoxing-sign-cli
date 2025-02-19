import { PPTSIGN } from '../configs/api';
import { cookieSerialize, request } from '../utils/request';

export const QRCodeSign = async (args: BasicCookie & { enc: string; name: string; fid: string; activeId: string }) => {
  const { enc, name, fid, activeId, ...cookies } = args;
  const url = `${PPTSIGN.URL}?enc=${enc}&name=${encodeURI(name)}&activeId=${activeId}&uid=${
    cookies._uid
  }&clientip=&useragent=&latitude=-1&longitude=-1&fid=${fid}&appType=15`;
  const result = await request(url, {
    secure: true,
    headers: {
      Cookie: cookieSerialize(cookies),
    },
  });
  if (result.data === 'success') {
    console.log(`[二维码]签到成功`);
    return 'success';
  } else {
    console.log(result.data);
    return result.data;
  }
};
