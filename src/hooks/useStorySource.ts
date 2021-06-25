import { useStorybookApi } from "@storybook/api";
import { useEffect, useState } from "react";
import { LocationsMap, SourceBlock } from "@storybook/source-loader";

interface SourceParams {
  source: string;
  locationsMap: LocationsMap;
  currentLocation?: SourceBlock;
}

export default function useStorySource() {
  const api = useStorybookApi();

  const [state, setState] = useState<SourceParams>({
    source: 'loading source...',
    locationsMap: {},
  });

  const story = api.getCurrentStoryData();

  console.log('state', state);

  useEffect(() => {
    if (story) {
      const {
        parameters: {
          // @ts-ignore
          storySource: { source, locationsMap },
        } = {},
      } = story;

      console.log('story', story);

      const currentLocation = locationsMap
        ? locationsMap[
          Object.keys(locationsMap).find((key: string) => {
            const sourceLoaderId = key.split('--');
            return story.id.endsWith(sourceLoaderId[sourceLoaderId.length - 1]);
          })
          ]
        : undefined;

      setState({ source, locationsMap, currentLocation });
    }
  }, [story ? story.id : null]);
}