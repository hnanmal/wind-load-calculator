// calculate_all.js (위치: src/lib/)
// 입력값을 받아 전체 풍하중 계산을 수행하는 종합 함수

import {
    getExposureParams,
    getZbar,
    getKz,
    getZoneA,
    getEffectiveWindArea,
    getEWA,
    calculateNa,
    calculateDynamicFactors,
    calculateG,
  } from './wind_calc_core';
  
  import { calculateKZT } from './topographic_factor';
  import { calculateVelocityPressure, calculatePressureList, calculatePressureSingle } from './calculate_pressures';
  import { interpolateFromTable } from '../utils/interpolation_utils';
  
  /**
   * 전체 풍하중 계산 실행 함수
   * @param {object} input - 사용자 입력 값
   * @param {object} tables - 보간용 계수 테이블들
   * @returns {object} - 계산 결과
   */
  export function calculateAll(input, tables) {
    const {
      exp,
      h,
      B,
      L,
      V,
      Kd,
      Type,
      blockage,
      xnew,
      purlin_s,
      purlin_l,
      StructuralType,
      Topographic_data,
      H_hill,
      Lh,
      x,
      UD,
    } = input;
  
    const expParams = getExposureParams(exp);
    const z_bar = getZbar(h, expParams);
    const Kz = getKz(h, expParams);
    const zoneA = getZoneA(B, L, h);
    const ewaVal = getEffectiveWindArea(purlin_s, purlin_l);
    const ewa = getEWA(ewaVal, zoneA);

    console.log("📏 EWA 계산 로그:");
    console.log("  - EWA 값 (m²):", ewaVal);
    console.log("  - zoneA (m):", zoneA, "→ zoneA²:", zoneA ** 2, "→ 4×zoneA²:", 4 * zoneA ** 2);
    console.log("  - 판정된 EWA 등급:", ewa);  // ✅ 여기에 EWA1, EWA2, EWA3 나와야 함

    const h_ft = h / 0.305;
    const na = calculateNa(h_ft, StructuralType);
    const dyn = calculateDynamicFactors({ h, B, L, V, expParams, na, beta: 0.02 });
    const G = calculateG({ na, Iz: dyn.Iz, Q: dyn.Q, R: dyn.R, gR: dyn.gR });
    const KZT = Topographic_data === 'yes'
      ? calculateKZT(exp, input.topoType, UD, H_hill, Lh, x, h, input.eave_h)
      : 1.0;
  
    const q = calculateVelocityPressure({ Kz, KZT, Kd, V });
  
    const CNW = ['A', 'B'].flatMap(dir =>
      ['gamma0', 'gamma180'].map(gamma =>
        interpolateFromTable(tables.CNW, `${Type}${dir}${gamma}${blockage.toUpperCase()}`, xnew))
    );
    
    const CNL = ['A', 'B'].flatMap(dir =>
      ['gamma0', 'gamma180'].map(gamma =>
        interpolateFromTable(tables.CNL, `${Type}${dir}${gamma}${blockage.toUpperCase()}`, xnew))
    );
    
    const CNgamma90 = ['gamma90<h', 'gamma90<2h', 'gamma90>2h'].flatMap(g =>
      ['A', 'B'].map(dir => {
        const key = `${Type}${dir}${g}${blockage.toUpperCase()}`;
        console.log("🔑 CNgamma90 key used:", key);
        return interpolateFromTable(tables.CNgamma90, key, xnew);
      })
    );
    
    const CNcc_by_zone = tables.CNccZones.map((zoneTable, z) => {
      return ['A', 'B'].map(dir => {
        const key = `${Type}${ewa}${blockage}${dir}`;
        console.log(`📌 Zone ${3 - z}, Key used: ${key}`);
        return interpolateFromTable(zoneTable, key, xnew);
      });
    });
    
    
  
    return {
      meta: { q, G, Kz, KZT, na, zoneA, ewa, h_ft },
      pressures: {
        mainCW: calculatePressureList(q, G, CNW),
        mainCL: calculatePressureList(q, G, CNL),
        gamma90: calculatePressureList(q, G, CNgamma90),
        cladding: CNcc_by_zone.map(row => row.map(C => calculatePressureSingle(q, G, C)))
      },
      coefficients: {
        CNW,
        CNL,
        CNgamma90,
        CNcc_by_zone
      }
    };
  }