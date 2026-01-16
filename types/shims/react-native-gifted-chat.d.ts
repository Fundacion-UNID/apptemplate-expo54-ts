declare module 'react-native-gifted-chat' {
  import * as React from 'react';
  export const GiftedChat: React.ComponentType<any> & {
    append: (currentMessages: any[], newMessages: any[]) => any[];
  };
  export const Bubble: React.ComponentType<any>;
  export const InputToolbar: React.ComponentType<any>;
  export const MessageText: React.ComponentType<any>;
  export const Send: React.ComponentType<any>;
  export const Composer: React.ComponentType<any>;
  export type IMessage = any;
  export type User = any;
}
