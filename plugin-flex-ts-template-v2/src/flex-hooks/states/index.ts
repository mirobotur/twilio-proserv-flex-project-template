import * as Flex from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';
import { OutboundCallerIDSelectorState, OutboundCallerIDSelectorReducer } from '../../feature-library/caller-id/flex-hooks/states/OutboundCallerIDSelector';
import { CallbackAndVoicemailState, CallbackAndVoicemailReducer } from '../../feature-library/callback-and-voicemail/flex-hooks/states/CallbackAndVoicemail'

// Register your redux store under a unique namespace
export const reduxNamespace = 'custom';

// Extend this payload to be of type that your ReduxAction is
// Normally you'd follow this pattern...https://redux.js.org/recipes/usage-with-typescript#a-practical-example
// But that breaks the typing when adding the reducer to Flex, so no payload intellisense for you!
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: {
    outboundCallerIdSelector: OutboundCallerIDSelectorState;
    callbackAndVoicemail: CallbackAndVoicemailState;
  };
};

// Combine the reducers
export default combineReducers({
  outboundCallerIdSelector: OutboundCallerIDSelectorReducer,
  callbackAndVoicemail: CallbackAndVoicemailReducer,
});

