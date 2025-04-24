// topographic_factor.js (위치: src/lib/)
// 지형 계수 KZT 계산 함수 모듈

const KZT_TABLE_1 = {
    "Exposure B": { "2Dridges": 1.3, "2Descarpments": 0.75, "3Daxisymmetric": 0.95 },
    "Exposure C": { "2Dridges": 1.45, "2Descarpments": 0.85, "3Daxisymmetric": 1.05 },
    "Exposure D": { "2Dridges": 1.55, "2Descarpments": 0.95, "3Daxisymmetric": 1.15 },
  };
  
  const KZT_TABLE_2 = {
    gammas: {
      "2Dridges": 3.0,
      "2Descarpments": 2.5,
      "3Daxisymmetric": 4.0,
    },
    mus: {
      "2DridgesUp": 1.5,
      "2DescarpmentsUp": 1.5,
      "3DaxisymmetricUp": 1.5,
      "2DridgesDown": 1.5,
      "2DescarpmentsDown": 4.0,
      "3DaxisymmetricDown": 1.5,
    },
  };
  
  /**
   * 지형 보정 계수 KZT 계산
   * @param {string} exposure - 노출 등급 ('Exposure B', 'C', 'D')
   * @param {string} topoType - 지형 형상 ('2Descarpments', ...)
   * @param {string} upDown - 'Up' or 'Down'
   * @param {number} H_hill - 언덕 높이
   * @param {number} Lh - 기준 거리
   * @param {number} x - 건물 위치 (양수: 후방, 음수: 전방)
   * @param {number} h - 건물 높이 (mean roof height)
   * @returns {number} - 계산된 KZT 값
   */
  export function calculateKZT(exposure, topoType, upDown, H_hill, Lh, x, h) {
    if (!topoType || topoType === 'no') return 1.0;
  
    const K1 = (H_hill / Lh > 0.5)
      ? KZT_TABLE_1[exposure][topoType] * 0.5
      : KZT_TABLE_1[exposure][topoType] * (H_hill / Lh);
  
    const K2 = 1 - Math.abs(x) / (KZT_TABLE_2.mus[topoType + upDown] * Lh);
    const gamma = KZT_TABLE_2.gammas[topoType];
    const K3 = Math.exp(-gamma * h / Lh);
  
    const KZT = (1 + K1 * K2 * K3) ** 2;
    return +KZT.toFixed(4);
  }