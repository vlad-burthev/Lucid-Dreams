import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { I_Option } from "./App";
import { useQuery } from "@tanstack/react-query";

const mainOptions: any[] = [
  { value: 0, name: "-", category: "category", id: Date.now() },
  { value: 0, name: "+", category: "category", id: Date.now() * 2 },
  { value: 0, name: "*", category: "category", id: Date.now() * 3 },
  { value: 0, name: "/", category: "category", id: Date.now() * 4 },
];

const CustomSelector = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const { isLoading, data } = useQuery({
    queryKey: ["option"],
    queryFn: () =>
      fetch("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete").then(
        (res) => res.json()
      ),
  });

  useEffect(() => {
    if (data) {
      setOptions([...data, ...mainOptions]);
    }
  }, [data]);

  const [selectedOption, setSelectedOption] = useState<any[]>([]);
  const [result, setResult] = useState(0);

  const handleSelect = (option: I_Option) => {
    setSelectedOption([...selectedOption, { ...option, key: Date.now() }]);
    setIsOpen(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const handleSelectOption = (option: I_Option) => {
    setInputValue("");
    handleSelect(option);
  };

  const deleteInputListItem = (key: number) => {
    const deleteElement = selectedOption.filter((el) => el.key !== key);
    setSelectedOption(deleteElement);
  };

  useMemo(() => {
    const filteredList = options.filter((el) =>
      el.name.includes(inputValue.trim().toLowerCase())
    );
    setFilteredOptions(filteredList);
  }, [inputValue, options]);

  useEffect(() => {
    let res = 0;

    selectedOption.forEach((option) => {
      if (typeof option.value === "number") {
        res += option.value;
      } else {
        switch (option.name) {
          case "+":
            res += selectedOption[selectedOption.indexOf(option) - 1].value;
            break;
          case "-":
            res -= selectedOption[selectedOption.indexOf(option) - 1].value;
            break;
          case "*":
            res *= selectedOption[selectedOption.indexOf(option) - 1].value;
            break;
          case "/":
            res /= selectedOption[selectedOption.indexOf(option) - 1].value;
            break;
          default:
            break;
        }
      }
    });

    setResult(res);
  }, [selectedOption]);

  console.log(selectedOption);

  return (
    <div>
      <div style={{ fontSize: "20px" }}>{result}</div>
      <div className="custom-selector">
        <pre className="custom-input">
          <ul className="custom-input__list">
            {selectedOption.map((option: any) => (
              <li key={option.key}>
                {option.name}
                <button onClick={() => deleteInputListItem(option.key)}>
                  x
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            onFocus={() => setIsOpen(true)}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Выберите значение..."
          />
          {isOpen &&
            (!isLoading ? (
              <ul className="custom-input__list-opinion">
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.id + index}
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.name}{" "}
                    {/* Используем option.name вместо option.label */}
                  </li>
                ))}
              </ul>
            ) : (
              "loading"
            ))}
        </pre>
      </div>
    </div>
  );
};

export default CustomSelector;
