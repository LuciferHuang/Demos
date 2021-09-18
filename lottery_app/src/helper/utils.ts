/**
 * 格式化数字
 * @param {number} num - 目标数字
 * @return {string}
*/
// eslint-disable-next-line no-confusing-arrow
export const numberFormate = (num: number): string => num < 10 ? `0${num}` : `${num}`;

/**
 * 按千分位分隔数字
 * @param {number} num
 * @return {string}
*/
export const splitThousand = (num: number): string => `${num}`.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');

/**
 * 回溯
 * @param {string[]} nums - 树
 * @param {number} depth -深度
 * @return {string[][]}
*/
export const permute = (nums: string[], depth: number): string[][] => {
  const res: string[][] = [];
  const visited: { [key: string]: unknown } = {};
  const dfs = (path: Array<string>) => {
    if (path.length === depth) {
      // 过滤重复结果
      const hasIndex = res.findIndex(result => (result.slice()).sort().toString() === (path.slice()).sort().toString());
      if (hasIndex === -1) {
        res.push(path.slice());
      }
      return;
    }
    for (let i = 0; i < nums.length; i += 1) {
      const num = nums[i];
      if (visited[num]) {
        continue;
      }
      visited[num] = true;
      path.push(num);
      dfs(path);
      visited[num] = false;
      path.pop();
    }
  };
  dfs([]);
  return res;
};

export const computeBet = (limitMap: any, choosed: any) : { isHit: boolean, num: number, result: { [key: string] : string[][] } }=> {
  const result: { [key: string] : string[][] } = {};
  const keys = Object.keys(limitMap);
  let isHit = true;
  const num = keys.reduce((prev, key) => {
    const min = limitMap[key];
    const target = choosed[key];
    if (Array.isArray(target) && target.length > 0) {
      if (target.length < min) {
        isHit = false;
        return 0;
      }
      const possible = permute(target, min);
      result[key] = possible;
      if (prev === 0) {
        return possible.length;
      }
      return prev * possible.length;
    }
    isHit = false;
    return 0;
  }, 0);
  return {
    isHit,
    num,
    result,
  };
}