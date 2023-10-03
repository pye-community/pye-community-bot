/**
 * TODO: High Priority - Change it to storage approach
 * Some handlers needs configuration e.g on which channel will some slash command works or which ones are the exepctión.
 * This is temportal, this should be configurable dinamically by slash commands
 * Since this should be an agnostic bot we need avoid linking server configuration like this, so changing it is a High Priority
 */

type ChannelsConfig = {
    cohere_channel_exceptions: string[];
};

const retos_channel = '1141493769699606528';

export const ChannelsConfig: ChannelsConfig = {
    cohere_channel_exceptions: [retos_channel],
};
