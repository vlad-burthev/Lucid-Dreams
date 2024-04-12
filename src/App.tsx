import React, { useState } from "react";
import CustomSelector from "./CustomSelector";

import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface I_Option {
  value: number | string;
  label: string;
  key?: number;
}
const queryClient = new QueryClient();

function App() {
  const [formulas, setFormulas] = useState<React.ReactElement<any, any>[]>([
    <CustomSelector />,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div>
          {/* {selectedOption.map((el: I_Option, index: number) => (
          <span key={index}>{el.label}</span>
        ))} */}

          {formulas.map(
            (ReactComponent: React.ReactElement<any, any>, index: number) => (
              <React.Fragment key={index}>{ReactComponent}</React.Fragment>
            )
          )}
        </div>
        <button
          className="add-formula__btn"
          onClick={() => setFormulas([...formulas, <CustomSelector />])}
        >
          + add time segment
        </button>
      </div>
    </QueryClientProvider>
  );
}

export default App;
