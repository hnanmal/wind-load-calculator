// interpolation_utils.js (위치: src/utils/)
// 테이블 기반 보간 함수: CNW, CNL, CNcc 등

/**
 * 선형 보간 함수
 * @param {number[]} x - x값 배열 (예: roof slopes)
 * @param {number[]} y - y값 배열 (예: 계수들)
 * @param {number} xNew - 보간할 지점
 * @returns {number|null} 보간 결과
 */
export function linearInterpolate(x, y, xNew) {
    if (x.length !== y.length) return null;
  
    for (let i = 0; i < x.length - 1; i++) {
      if (xNew >= x[i] && xNew <= x[i + 1]) {
        const ratio = (xNew - x[i]) / (x[i + 1] - x[i]);
        return y[i] + ratio * (y[i + 1] - y[i]);
      }
    }
    return null; // 범위 벗어남
  }
  
  /**
   * 테이블 객체에서 특정 키에 대한 보간 실행
   * @param {Object} table - 테이블 객체 (DataFrame 변환된 형태)
   * @param {string} key - 열 이름 (예: 'OMAgamma0C')
   * @param {number} xNew - 보간할 경사 값 (예: 37도)
   * @returns {number|null} 보간 결과
   */
  export function interpolateFromTable(table, key, xNew) {
    const x = table['RoofSlop'];
    const y = table[key];
    return linearInterpolate(x, y, xNew);
  }
  