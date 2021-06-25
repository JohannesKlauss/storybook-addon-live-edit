import React from "react";
import { useParameter } from "@storybook/api";
import { PARAM_KEY } from "./constants";
import { TabContent } from "./components/TabContent";
import { LiveEditParams } from "./types";

interface TabProps {
  active: boolean;
}

export const Tab: React.FC<TabProps> = ({ active }) => {
  // https://storybook.js.org/docs/react/addons/addons-api#useparameter
  const paramData = useParameter<LiveEditParams>(PARAM_KEY, {});

  return (
    active ? <TabContent params={paramData}/> : null
  )
};
