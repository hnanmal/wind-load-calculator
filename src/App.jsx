// App.jsx (위치: src/)
// init
import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultPanel from './components/ResultPanel';
import { calculateAll } from './lib/calculate_all';
import * as tables from './data/tables'; // CNW, CNL, CNgamma90, CNccZones 등 사전 import

export default function App() {
  const [input, setInput] = useState(null);
  const [result, setResult] = useState(null);

  const handleCalculate = (inputValues) => {
    setInput(inputValues);
    const res = calculateAll(inputValues, tables);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🌬️ 풍하중 계산기</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputForm onSubmit={handleCalculate} />
        <ResultPanel result={result} />
      </div>
    </div>
  );
}
