import {
    Chat,
    ChatInput,
    Conversation,
    NewSessionButton,
    Session,
    SessionGroups,
    SessionListItem,
    SessionMessage,
    SessionMessages,
    SessionMessagePanel,
    SessionMessagesHeader,
    SessionsGroup,
    SessionsList,
} from 'reachat';

import { chatTheme as defaultTheme, ChatTheme } from 'reachat';
import { twMerge } from 'tailwind-merge';

export const ReaChat = () => {
    return (
        <Chat sessions={[]} theme={chatTheme}>
            <SessionsList>
                <NewSessionButton />
                <SessionGroups>
                    {groups =>
                        groups.map(({ heading, sessions }) => (
                            <SessionsGroup heading={heading} key={heading}>
                                {sessions.map(s => (
                                    <SessionListItem key={s.id} session={s} />
                                ))}
                            </SessionsGroup>
                        ))
                    }
                </SessionGroups>
            </SessionsList>
            <SessionMessagePanel>
                <SessionMessagesHeader />
                <SessionMessages>
                    {conversations =>
                        conversations.map(conversation => (
                            <SessionMessage
                                key={conversation.id}
                                conversation={conversation}
                            />
                        ))
                    }
                </SessionMessages>
                <ChatInput />
            </SessionMessagePanel>
        </Chat>
    );
};

export const chatTheme: ChatTheme = {
  ...defaultTheme,
  sessions: {
    ...defaultTheme.sessions,
    console: twMerge(defaultTheme.sessions.console, 'min-w-[300px]'),
    session: {
      ...defaultTheme.sessions.session,
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-70 hover:opacity-100 transition-opacity',
    }
  },
  messages: {
    ...defaultTheme.messages,
    base: 'py-4 pr-4',
    message: {
      ...defaultTheme.messages.message,
      question: twMerge(defaultTheme.messages.message.question, 'text-purple-300 text-lg'),
      response: 'border-l border-purple-300 pl-4'
    } 
  }
};
