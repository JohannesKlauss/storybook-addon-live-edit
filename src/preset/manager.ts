import { addons, types } from "@storybook/addons";

import { ADDON_ID, TOOL_ID, PANEL_ID } from "../constants";
import { Tool } from "../Tool";
import { Panel } from "../Panel";
import { Tab } from "../Tab";

const title = "Live Edit"

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  });

  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title,
    match: ({ viewMode }) => viewMode === "story",
    render: Panel,
  });

  // Register the tab
  addons.add(PANEL_ID, {
    type: types.TAB,
    title,
    //👇 Checks the current route for the story
    route: ({ storyId }) => `/live-edit/${storyId}`,
    //👇 Shows the Tab UI element in myaddon view mode
    match: ({ viewMode }) => viewMode === "live-edit",
    render: Tab,
  });
});
