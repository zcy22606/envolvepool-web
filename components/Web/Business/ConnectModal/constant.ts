import { ConnectType } from '@/service/webApi/user/type';

export enum ParticipationStatus {
  INVITE_CODE = 'invite code',
  SUCCESS = 'success'
}

export const connectKeyMap = [
  {
    key: ConnectType.WALLET,
    label: 'connectWallet',
    connected: false
  },
  // {
  //   key: ConnectType.TWITTER,
  //   label: 'twitterVerify',
  //   connected: false
  // },
  // {
  //   key: ConnectType.DISCORD,
  //   label: 'connectDiscord',
  //   connected: false
  // },
  {
    key: ParticipationStatus.INVITE_CODE,
    label: 'inputInviteCode',
    connected: false
  }
];

export const defaultConnectState = [
  {
    type: ConnectType.WALLET,
    isConnect: false,
    connectInfo: {}
  },
  // {
  //   type: ConnectType.TWITTER,
  //   isConnect: false,
  //   connectInfo: {}
  // },
  // {
  //   type: ConnectType.DISCORD,
  //   isConnect: false,
  //   connectInfo: {}
  // },
  {
    type: ParticipationStatus.INVITE_CODE,
    isConnect: false,
    connectInfo: {}
  }
];
