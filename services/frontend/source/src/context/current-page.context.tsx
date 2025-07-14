import { isbot } from "isbot";
import React, { useMemo, useState } from "react";

export interface CurrentPageContextInterface {
  title: string;
  setTitle: (text: string) => void;
}

export const CurrentPageContextDefaults: CurrentPageContextInterface = {
  title: "",
  setTitle: () => {
    return;
  },
};

export const CurrentPageContext =
  React.createContext<CurrentPageContextInterface>(CurrentPageContextDefaults);

export const CurrentPageContextProvider = ({ children }: any) => {
  const [topBarTitle, setTopBarTitle] = useState<string>("");

  const setTitle = (text: string) => {
    const isBot = isbot(navigator.userAgent);
    if (isBot) {
      document.title = `DEMO`;
    } else {
      document.title = `demo | ${text}`;
      setTopBarTitle(text);
    }
  };

  const value = useMemo(
    () => ({
      title: topBarTitle,
      setTitle,
    }),
    [topBarTitle]
  );
  return (
    <CurrentPageContext.Provider value={value}>
      {children}
    </CurrentPageContext.Provider>
  );
};
