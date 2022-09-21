import { ChangeEvent, useEffect, useState, useRef } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

// import "./styles.css";

const usePrevious = <T extends {}>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export interface ComboInputSelectValue {
  select: string;
  input: string;
}

export interface ComboInputSelectOption {
  key: string;
  value: string;
  default: string;
}

export interface ComboInputSelectProps {
  options: ComboInputSelectOption[];
  onChange: (data: ComboInputSelectValue) => void;
}

export const ComboInputSelect = ({ options, onChange }: ComboInputSelectProps) => {
  const [state, setState] = useState(() => {
    const first = options[0];
    return { input: first.default, select: first.value };
  });

  const lastState = usePrevious(state);

  const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, input: e.target.value });
  };
  const updateSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setState({ ...state, select: e.target.value });
  };

  useEffect(() => {
    if (lastState?.select !== state.select) {
      const index = options.findIndex((v) => v.value === state.select);
      setState({ ...state, input: options[index].default });
    }
    onChange(state);
  }, [state]);

  return (
    <div>
      <input
        name="input"
        type="text"
        onChange={updateInput}
        value={state.input}
      />
      <select name="select" onChange={updateSelect} value={state.select}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
    </div>
  );
}