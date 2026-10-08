import { useState } from 'react';
import './App.css';

const SURNAME = 'Ordoñez';
const FULL_NAME = 'John Marvin Ordoñez';

function CalcDisplay({ dispValue }) {
  // smaller, single-line text when the full name is shown
  const cls = dispValue === FULL_NAME ? 'Display DisplayName' : 'Display';
  return <div className={cls}>{dispValue}</div>;
}

function CalcButton({ buttonLabel, buttonClassname = 'Button', onClick }) {
  return (
    <button className={buttonClassname} onClick={onClick}>
      {buttonLabel}
    </button>
  );
}

function compute(a, b, op) {
  let result;
  switch (op) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = b === 0 ? NaN : a / b; break;
    default:  result = b;
  }
  // trim floating point noise (0.1 + 0.2 -> 0.3)
  return Number.isFinite(result) ? parseFloat(result.toFixed(10)) : NaN;
}

function App() {
  const [disp, setDisp] = useState('0');
  const [operand1, setOperand1] = useState(null); // number before the operator
  const [operator, setOperator] = useState(null); // pending operator
  const [waiting, setWaiting] = useState(false);  // next digit starts a new number

  const showResult = (result) => {
    if (Number.isNaN(result)) {
      setDisp('Error');
      setOperand1(null);
      setOperator(null);
      setWaiting(true);
      return false;
    }
    setDisp(String(result));
    return true;
  };

  const handleDigit = (digit) => {
    if (waiting || disp === 'Error') {
      setDisp(String(digit));
      setWaiting(false);
    } else {
      setDisp(disp === '0' ? String(digit) : disp + digit);
    }
  };

  const handleDecimal = () => {
    if (waiting || disp === 'Error') {
      setDisp('0.');
      setWaiting(false);
    } else if (!disp.includes('.')) {
      setDisp(disp + '.');
    }
  };

  const handleBackspace = () => {
    if (waiting || disp === 'Error') return;
    setDisp(disp.length > 1 ? disp.slice(0, -1) : '0');
  };

  // shows the full name on the display and resets the pending calculation
  const handleSurname = () => {
    setDisp(FULL_NAME);
    setOperand1(null);
    setOperator(null);
    setWaiting(true);
  };

  const handleOperator = (op) => {
    if (disp === 'Error' || disp === FULL_NAME) return;
    const current = parseFloat(disp);

    if (operand1 !== null && operator && !waiting) {
      // chained: 2 + 3 + ... computes 2 + 3 first
      const result = compute(operand1, current, operator);
      if (!showResult(result)) return;
      setOperand1(result);
    } else if (operand1 === null) {
      setOperand1(current);
    }
    setOperator(op);
    setWaiting(true);
  };

  const handleEquals = () => {
    if (operator === null || operand1 === null || waiting) return;
    const result = compute(operand1, parseFloat(disp), operator);
    if (!showResult(result)) return;
    setOperand1(null);
    setOperator(null);
    setWaiting(true);
  };

  const handleClear = () => {
    setDisp('0');
    setOperand1(null);
    setOperator(null);
    setWaiting(false);
  };

  return (
    <div className="App">
      <div className="Header">Calculator of John Marvin Ordoñez - WMD3A</div>
      <div className="Calculator">
        <CalcDisplay dispValue={disp} />
        <div className="Keypad">
          <CalcButton buttonLabel={7} onClick={() => handleDigit(7)} />
          <CalcButton buttonLabel={8} onClick={() => handleDigit(8)} />
          <CalcButton buttonLabel={9} onClick={() => handleDigit(9)} />
          <CalcButton buttonLabel="+" buttonClassname="Button Operator" onClick={() => handleOperator('+')} />
          <CalcButton buttonLabel={4} onClick={() => handleDigit(4)} />
          <CalcButton buttonLabel={5} onClick={() => handleDigit(5)} />
          <CalcButton buttonLabel={6} onClick={() => handleDigit(6)} />
          <CalcButton buttonLabel="*" buttonClassname="Button Operator" onClick={() => handleOperator('×')} />
          <CalcButton buttonLabel={1} onClick={() => handleDigit(1)} />
          <CalcButton buttonLabel={2} onClick={() => handleDigit(2)} />
          <CalcButton buttonLabel={3} onClick={() => handleDigit(3)} />
          <CalcButton buttonLabel="-" buttonClassname="Button Operator" onClick={() => handleOperator('-')} />
          <CalcButton buttonLabel="C" buttonClassname="Button Clear" onClick={handleClear} />
          <CalcButton buttonLabel={0} onClick={() => handleDigit(0)} />
          <CalcButton buttonLabel="=" buttonClassname="Button Equals" onClick={handleEquals} />
          <CalcButton buttonLabel="÷" buttonClassname="Button Operator" onClick={() => handleOperator('÷')} />
          <CalcButton buttonLabel={SURNAME} buttonClassname="Button Wide" onClick={handleSurname} />
        </div>
      </div>
    </div>
  );
}

export default App;
