import * as Flex from '@twilio/flex-ui';
import { FlexEvent } from "../../../../types/manager/FlexEvent";

import { UIAttributes } from 'types/manager/ServiceConfiguration';
const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.scrollable_activities;

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;
  
  console.log(`Feature enabled: scrollable-activities`);
};

export default pluginsLoadedHandler;
