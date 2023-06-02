const { v4: uuidv4 } = require('uuid')

let cache:any = {};

export function updateCache(uuid: string)
{
  let key:string = uuidv4();
  let token:string = uuidv4();
  key = key.replace(/-/g,"");
  token = token.replace(/-/g,"");
  cache[key] = {
    udid: uuid,
    token: token,
    time: (new Date()).getTime()
  };
  return key;
}

export function updateData(key: string, dataKey: string, data: any)
{
  if(!cache[key]) return false;
  
  cache[key][dataKey] = data;
  return true;
}

export function updateToken(key: string)
{
  if(!cache[key])
  {
    return "";
  }
  
  let token:string = uuidv4();
  token = token.replace(/-/g,"");
  cache[key].token = token;
  cache[key].time = (new Date()).getTime();
  return token;
}

export function getCache(key: string)
{
  if(key == "") return null;
  if(cache[key])
  {
    cache[key].time = (new Date()).getTime();
    return cache[key];
  }
  return null;
}

export function setCache(key: string, vKey:string, value: any)
{
  if(!cache[key])
  {
    return ;
  }
  if(cache[key])
  {
    cache[vKey] = value;
    cache[key].time = (new Date()).getTime();
    return cache[key];
  }
}

function cleanup()
{
  //TODO:
  console.log(cache);
}

//setInterval(cleanup, 7000);