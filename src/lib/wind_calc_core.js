// wind_calc_core.js
// 주요 입력값과 노출계수에 따른 기초 계산 + 동계수 계산 함수들 포함 (위치: src/lib/)

const EXPOSURE_DB = {
  "Exposure B": {
    c: 0.3,
    l: 97.54,
    epsilon: 1 / 3,
    alpha_bar: 1 / 4,
    b: 0.45,
    z_min: 9.14,
    z_g: 365.76,
    alpha: 7.0,
  },
  "Exposure C": {
    c: 0.2,
    l: 152.4,
    epsilon: 1 / 5,
    alpha_bar: 1 / 6.5,
    b: 0.65,
    z_min: 4.57,
    z_g: 274.32,
    alpha: 9.5,
  },
  "Exposure D": {
    c: 0.15,
    l: 198.12,
    epsilon: 1 / 8,
    alpha_bar: 1 / 9.0,
    b: 0.8,
    z_min: 2.13,
    z_g: 213.36,
    alpha: 11.5,
  },
};

export function getExposureParams(exp) {
  return EXPOSURE_DB[exp];
}

export function getZbar(h, expParams) {
  return Math.max(h * 0.6, expParams.z_min);
}

export function getKz(h, expParams) {
  const z = Math.max(h, 4.572);
  return +(2.01 * (z / expParams.z_g) ** (2 / expParams.alpha)).toFixed(4);
}

export function getZoneA(B, L, h) {
  return Math.max(
    Math.min(B * 0.1, L * 0.1, 0.4 * h),
    0.04 * Math.min(B, L),
    0.9
  );
}

export function getEffectiveWindArea(purlin_s, purlin_l) {
  return Math.max(purlin_s * purlin_l, (purlin_l ** 2) / 3);
}

export function getEWA(EWA, zone_a) {
  if (EWA <= zone_a ** 2) return "EWA1";
  if (EWA <= 4 * zone_a ** 2) return "EWA2";
  return "EWA3";
}

export function calculateNa(h_ft, structuralType) {
  if (structuralType === "Steel") return 22.2 / h_ft ** 0.8;
  if (structuralType === "Concrete") return 43.5 / h_ft ** 0.9;
  return 75 / h_ft;
}

export function calculateDynamicFactors({ h, B, L, V, expParams, na, beta }) {
  const z_bar = getZbar(h, expParams);
  const Lz = expParams.l * (z_bar / 10) ** expParams.epsilon;
  const Q = 1 / Math.sqrt(1 + 0.63 * ((B + h) / Lz) ** 0.63);
  const Vz = expParams.b * (z_bar / 10) ** expParams.alpha_bar * V;
  const N1 = na * Lz / Vz;
  const Rn = 7.47 * N1 / Math.pow(1 + 10.3 * N1, 5 / 3);
  const eta = (val) => 4.6 * na * val / Vz;
  const exp = Math.exp;
  const Rh = 1 / eta(h) - (1 / (2 * eta(h) ** 2)) * (1 - exp(-2 * eta(h)));
  const RB = 1 / eta(B) - (1 / (2 * eta(B) ** 2)) * (1 - exp(-2 * eta(B)));
  const RL = 1 / eta(L) - (1 / (2 * eta(L) ** 2)) * (1 - exp(-2 * eta(L)));
  const R = Math.sqrt((1 / beta) * Rn * Rh * RB * (0.53 + 0.479 * RL));
  const Iz = expParams.c * (10 / z_bar) ** (1 / 6);
  const gR = Math.sqrt(2 * Math.log(3600 * na)) + 0.577 / Math.sqrt(2 * Math.log(3600 * na));

  return { Lz, Q, Vz, Rn, Rh, RB, RL, R, Iz, gR };
}

export function calculateG({ na, Iz, Q, R, gR }) {
  const gq = 3.4, gv = 3.4;
  if (na >= 1) {
    return 0.925 * ((1 + 1.7 * gq * Iz * Q) / (1 + 1.7 * gv * Iz));
  } else {
    return 0.925 * ((1 + 1.7 * Iz * Math.sqrt(gq ** 2 * Q ** 2 + gR ** 2 * R ** 2)) / (1 + 1.7 * gv * Iz));
  }
}