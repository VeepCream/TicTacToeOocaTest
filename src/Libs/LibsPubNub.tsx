import PubNub from 'pubnub';

export const PubNubInit = (username: string) => {
  return new PubNub({
    publishKey: "pub-c-868ad9fb-4cec-41ba-a91e-260acc82c21b",
    subscribeKey: "sub-c-883a28a0-1e15-11ea-8c76-2e065dbe5941",
    uuid: username
  });
}
