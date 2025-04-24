// ResultPanel.jsx (위치: src/components/)
export default function ResultPanel({ result }) {
    if (!result) {
      return <div className="text-gray-500 italic">결과가 여기에 표시됩니다.</div>;
    }
  
    const { pressures, meta, coefficients } = result;
  
    const renderList = (title, values) => (
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <ul className="pl-4 list-disc text-sm text-gray-800">
          {values.map((v, i) => (
            <li key={i}>{v} Pa</li>
          ))}
        </ul>
      </div>
    );
  
    return (
      <div className="bg-white p-4 rounded shadow max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">📊 계산 결과</h2>
  
        <div className="grid grid-cols-2 gap-4">
          {renderList('Main 구조물 (CW)', pressures.mainCW)}
          {renderList('Main 구조물 (CL)', pressures.mainCL)}
          {renderList('γ=90도', pressures.gamma90)}
          {pressures.cladding.map((zonePressures, i) =>
            renderList(`Cladding Zone ${3 - i}`, zonePressures)
          )}
        </div>
  
        <div className="mt-6">
          <h3 className="font-semibold mb-2">🔍 중간값 (meta)</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(meta).map(([k, v]) => (
              <li key={k}><strong>{k}</strong>: {v}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }