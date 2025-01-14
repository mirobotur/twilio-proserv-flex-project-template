const { isString, isObject, isNumber } = require("lodash");

const retryHandler = (require(Runtime.getFunctions()['functions/common/twilio-wrappers/retry-handler'].path)).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {string} parameters.agentSid the worker we will be coaching
 * @param {string} parameters.muted the muted status
 * @param {string} parameters.coaching the coaching status
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.coachToggle = async function coachToggle(parameters) {

  const {context, conferenceSid, participantSid, agentSid, muted, coaching, scriptName, attempts} = parameters;

  if(!isObject(context))
      throw "Invalid parameters object passed. Parameters must contain reason context object";
  if(!isString(conferenceSid))
      throw "Invalid parameters object passed. Parameters must contain conferenceSid string";
  if(!isString(participantSid))
      throw "Invalid parameters object passed. Parameters must contain participantSid string";
  if(!isString(agentSid))
      throw "Invalid parameters object passed. Parameters must contain agentSid string";
  if(!isString(muted))
      throw "Invalid parameters object passed. Parameters must contain muted boolean";
  if(!isString(coaching))
      throw "Invalid parameters object passed. Parameters must contain coaching boolean";
  if(!isString(scriptName))
      throw "Invalid parameters object passed. Parameters must contain scriptName of calling function";
  if(!isNumber(attempts))
      throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  try {  
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid)
        .participants(participantSid)
        .update(
            { 
                coaching: coaching,
                callSidToCoach: agentSid,
                muted: muted
            }
        )
    return { success: true, updatedConference, status: 200 };
  }
  catch (error) {
    return retryHandler(
        error, 
        parameters,
        arguments.callee
    )
  }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {boolean} parameters.muted the muted status
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.bargeToggle = async function bargeToggle(parameters) {

  const {context, conferenceSid, participantSid, muted, scriptName, attempts} = parameters;

    
  if(!isObject(context))
      throw "Invalid parameters object passed. Parameters must contain reason context object";
  if(!isString(conferenceSid))
      throw "Invalid parameters object passed. Parameters must contain conferenceSid string";
  if(!isString(participantSid))
      throw "Invalid parameters object passed. Parameters must contain participantSid string";
  if(!isString(muted))
      throw "Invalid parameters object passed. Parameters must contain muted boolean";
  if(!isString(scriptName))
      throw "Invalid parameters object passed. Parameters must contain scriptName of calling function";
  if(!isNumber(attempts))
      throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  try {  
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid)
        .participants(participantSid)
        .update(
            { 
                muted: muted
            }
        )
    return { success: true, updatedConference, status: 200 };
  }
  catch (error) {
    return retryHandler(
        error, 
        parameters,
        arguments.callee
    )
  }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the unique task SID to modify
 * @param {string} parameters.to the phone number to add to the conference
 * @param {string} parameters.from the caller ID to use when calling the to number
 * @returns {Participant} The newly created conference participant
 * @description adds the specified phone number as a conference participant
 */
exports.addParticipant = async (parameters) => {
    
    const { context, taskSid, to, from } = parameters;

    if(!isObject(context))
        throw "Invalid parameters object passed. Parameters must contain reason context object";
    if(!isString(taskSid))
        throw "Invalid parameters object passed. Parameters must contain taskSid string";
    if(!isString(to))
        throw "Invalid parameters object passed. Parameters must contain to string";
    if(!isString(from))
        throw "Invalid parameters object passed. Parameters must contain from string";

    try {
        const client = context.getTwilioClient();
        
        const participantsResponse = await client
            .conferences(taskSid)
            .participants
            .create({
                to,
                from,
                earlyMedia: true,
                endConferenceOnExit: false
            });

        return { success: true, participantsResponse, status: 200 };
    }
    catch (error) {
        return retryHandler(
            error, 
            parameters,
            arguments.callee
        )
    }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.hold whether to hold or unhold the participant
 * @returns {Participant} The newly updated conference participant
 * @description holds or unholds the given conference participant
 */
exports.holdParticipant = async (parameters) => {
    
    const { context, conference, participant, hold } = parameters;

    if(!isObject(context))
        throw "Invalid parameters object passed. Parameters must contain reason context object";
    if(!isString(conference))
        throw "Invalid parameters object passed. Parameters must contain conference string";
    if(!isString(participant))
        throw "Invalid parameters object passed. Parameters must contain participant string";
    if(!isBoolean(hold))
        throw "Invalid parameters object passed. Parameters must contain hold boolean";

    try {
        const client = context.getTwilioClient();
        
        const participantsResponse = await client
            .conferences(conference)
            .participants(participant)
            .update({
              hold,
            });

        return { success: true, participantsResponse, status: 200 };
    }
    catch (error) {
        return retryHandler(
            error, 
            parameters,
            arguments.callee
        )
    }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to remove
 * @returns empty response object
 * @description removes the given conference participant
 */
exports.removeParticipant = async (parameters) => {
    
    const { context, conference, participant } = parameters;

    if(!isObject(context))
        throw "Invalid parameters object passed. Parameters must contain reason context object";
    if(!isString(conference))
        throw "Invalid parameters object passed. Parameters must contain conference string";
    if(!isString(participant))
        throw "Invalid parameters object passed. Parameters must contain participant string";

    try {
        const client = context.getTwilioClient();
        
        const participantsResponse = await client
            .conferences(conference)
            .participants(participant)
            .remove();

        return { success: true, participantsResponse, status: 200 };
    }
    catch (error) {
        return retryHandler(
            error, 
            parameters,
            arguments.callee
        )
    }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.endConferenceOnExit whether to end conference when the participant leaves
 * @returns {Participant} The newly updated conference participant
 * @description sets endConferenceOnExit on the given conference participant
 */
exports.updateParticipant = async (parameters) => {
    
    const { context, conference, participant, endConferenceOnExit } = parameters;

    if(!isObject(context))
        throw "Invalid parameters object passed. Parameters must contain reason context object";
    if(!isString(conference))
        throw "Invalid parameters object passed. Parameters must contain conference string";
    if(!isString(participant))
        throw "Invalid parameters object passed. Parameters must contain participant string";
    if(!isBoolean(endConferenceOnExit))
        throw "Invalid parameters object passed. Parameters must contain endConferenceOnExit boolean";

    try {
        const client = context.getTwilioClient();
        
        const participantsResponse = await client
            .conferences(conference)
            .participants(participant)
            .update({
              endConferenceOnExit,
            });

        return { success: true, participantsResponse, status: 200 };
    }
    catch (error) {
        return retryHandler(
            error, 
            parameters,
            arguments.callee
        )
    }
}
