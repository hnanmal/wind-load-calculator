import { useState } from 'react';

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    exp: 'Exposure C',
    h: 14,
    B: 15,
    L: 20,
    V: 58,
    Kd: 0.85,
    xnew: 37,
    Type: 'OM',
    blockage: 'C',
    StructuralType: 'Steel',
    purlin_s: 1.2,
    purlin_l: 6,
    Topographic_data: 'no',
    H_hill: 280.7,
    Lh: 561.454,
    x: -1127,
    UD: 'Up',
    topoType: '2Descarpments',
    eave_h: "", // 지붕 처마 높이
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: isNaN(value) ? value : parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields = [
    ['exp', '노출 등급', ['Exposure B', 'Exposure C', 'Exposure D']],
    ['V', '기본 풍속 (m/s)'],
    ['h', '평균 지붕높이 h (m)'],
    ['B', '건물 폭 B (m)'],
    ['L', '건물 길이 L (m)'],
    ['xnew', '지붕 경사 (도)'],
    ['Type', '건물 유형', ['OM', 'OP']],
    ['blockage', '차단 여부', ['C', 'O']],
    ['StructuralType', '구조 형식', ['Steel', 'Concrete', 'Other']],
    ['purlin_s', '퍼린 간격 (m)'],
    ['purlin_l', '퍼린 길이 (m)'],
    ['Topographic_data', '지형 영향 고려', ['yes', 'no']],
  ];

  const topoFields = [
    ['topoType', '지형 유형', ['2Dridges', '2Descarpments', '3Daxisymmetric']],
    ['H_hill', '언덕 높이 (m)'],
    ['Lh', '기준 거리 Lh (m)'],
    ['x', '정상으로부터 거리 x (m)'],
    ['UD', '위치', ['Up', 'Down']],
    ['eave_h', '건물 처마 높이 (m)'], // 🔥 새로 추가됨
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">📥 입력값</h2>

      {[...fields, ...(form.Topographic_data === 'yes' ? topoFields : [])].map(([key, label, options]) => (
        <div key={key}>
          <label className="block font-medium mb-1">{label}</label>
          {options ? (
            <select
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          )}
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-600 text-black py-2 rounded">
        계산하기
      </button>
    </form>
  );
}
