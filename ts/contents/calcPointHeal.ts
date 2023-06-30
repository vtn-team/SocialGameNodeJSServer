
export function calcPointHeal(user: any)
{
  try
  {
    let now: any = new Date();
    let nowTime: number = (new Date()).getTime();
    let lastTime: number = (new Date(user.lastPointUpdate)).getTime();
    
    //体力回復は1分で1
    let healMovePoint = Math.floor((nowTime - lastTime) / (1000 * 60));
    user.movePoint += healMovePoint;
    user.movePoint = Math.floor(user.movePoint);
    
    //TODO: 上限値はテーブルから見る
    if(user.movePoint > 30) user.movePoint = 30;
    
    //バトルポイントは1時間で1
    let healAttackPoint = Math.floor((nowTime - lastTime) / (1000 * 60 * 60));
    user.attackPoint += healAttackPoint;
    user.attackPoint = Math.floor(user.attackPoint);
    
    user.lastPointUpdate = now.toLocaleString();
  }
  catch(ex)
  {
  }
}
