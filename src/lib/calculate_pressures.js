// calculate_pressures.js (위치: src/lib/)
// 풍압 계산 모듈 (Main Structure & Cladding)

/**
 * 풍속 압력 q 계산
 */
export function calculateVelocityPressure({ Kz, KZT, Kd, V }) {
    return 0.613 * Kz * KZT * Kd * V ** 2; // in Pascals
  }
  
  /**
   * Net Pressure = q * G * C
   * @param {number} q - 풍속 압력
   * @param {number} G - Gust Effect Factor
   * @param {number[]} C_list - 계수 배열 (CNW, CNL, CNcc 등)
   * @returns {number[]} 압력값 배열 (Pa)
   */
  export function calculatePressureList(q, G, C_list) {
    return C_list.map(C => +(q * G * C).toFixed(1));
  }
  
  /**
   * 단일 계수에 대한 풍압 계산 (CNcc용)
   */
  export function calculatePressureSingle(q, G, C) {
    return +(q * G * C).toFixed(1);
  }
  
  /**
   * 최대/최소 압력 추출
   */
  export function getPressureStats(pressureList) {
    return {
      max: Math.max(...pressureList),
      min: Math.min(...pressureList)
    };
  }