// ResultPanel.jsx (위치: src/components/)
export default function ResultPanel({ result, input }) {
  if (!result || !input) {
    return <div className="text-gray-500 italic">결과가 여기에 표시됩니다.</div>;
  }

  const { pressures, meta, coefficients } = result;
  const { mainCW, mainCL, gamma90, cladding } = pressures;
  const { CNW, CNL, CNgamma90, CNcc_by_zone } = coefficients;

  const renderPairs = (title, coeffs, pressures) => (
    <div className="mb-4">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <ul className="pl-4 list-disc text-sm text-gray-800">
        {coeffs.map((c, i) => (
          <li key={i}>계수: {c} → 풍압: {pressures[i]} Pa</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded shadow max-h-screen overflow-y-auto text-sm">
      <h2 className="text-xl font-semibold mb-4">📊 풍하중 계산 결과</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">&lt;Basic Input Data&gt;</h3>
        <ul className="list-disc pl-4">
          <li>Exposure Class : {input.exp}</li>
          <li>Basic Wind Speed : {input.V} m/s</li>
          <li>Building Mean Roof Height : {input.h} m</li>
          <li>Building Dimension normal to wind, B : {input.B} m</li>
          <li>Building Dimension parallel to wind, L : {input.L} m</li>
          <li>Building Type : {input.Type === 'OM' ? 'Open Monoslope' : 'Open Pitched'}</li>
          <li>Building Roof Angle : {input.xnew} degree</li>
          <li>Building Purlin Spacing : {input.purlin_s} m</li>
          <li>Building Purlin Un-supported Length : {input.purlin_l} m</li>
          <li>Should Consider Topographic Feature? {input.Topographic_data}</li>
        </ul>
      </div>

      {input.Topographic_data === 'yes' && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">&lt;Topographic Input Data&gt;</h3>
          <ul className="list-disc pl-4">
            <li>Building Eave Height : {input.eave_h} m</li>
            <li>Distance upwind of crest to where the difference in ground elevation in half the height of hill : {input.Lh} m</li>
            <li>Height of Hill : {input.H_hill} m</li>
            <li>Distance from the crest to the building site : {Math.abs(input.x)} m</li>
            <li>Topographic Type : {input.topoType}</li>
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold mb-2">&lt;Wind Load Calculation Basis&gt;</h3>
        <ul className="list-disc pl-4">
          <li>Effective Wind Area = {meta.ewaVal ?? (input.purlin_s * input.purlin_l).toFixed(1)} m²</li>
          <li>Corner Zone Width a = {meta.zoneA} m</li>
          <li>Fundamental Frequency = {meta.na.toFixed(4)}</li>
          <li>Gust-Effect Factor, G = {meta.G.toFixed(4)}</li>
          <li>Velocity Pressure Exposure Coefficient KZ = [{meta.Kz}]</li>
          <li>Topographic Factor, KZT = {meta.KZT}</li>
        </ul>
      </div>

      <h3 className="font-semibold text-lg mb-1">&lt;Wind Pressure for Main Structure&gt;</h3>
      {renderPairs('Net Pressure Coefficient, C_NW / CW', CNW, mainCW)}
      {renderPairs('Net Pressure Coefficient, C_NL / CL', CNL, mainCL)}
      {renderPairs('Net Pressure Coefficient, CN_gamma90', CNgamma90, gamma90)}

      <div className="mt-6">
        <h3 className="font-semibold text-lg">&lt;Wind Pressure for Components and Cladding&gt;</h3>
        {cladding.map((zonePressures, z) => (
          <div key={z} className="mt-3">
            <h4 className="font-semibold">Cladding Zone: {3 - z}</h4>
            <ul className="pl-4 list-disc">
              {zonePressures.map((p, i) => {
                const cncc = CNcc_by_zone[z]?.[i];
                return (
                  <li key={i}>
                    CNcc for Loadcase {i === 0 ? 'A' : 'B'} = {cncc ?? '⚠️ 계수 없음'} → Pressure = {p} Pa
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}