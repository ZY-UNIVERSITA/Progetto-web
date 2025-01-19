<script lang="ts">
import { io, Socket } from 'socket.io-client';
import { defineComponent, PropType } from 'vue';
import { UserToken, Messages, ChatMessage, User_messages, Friends_list } from '../utils/types';
import axios from 'axios';

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserToken | null>,
      required: false,
    },
    mode: {
      type: String as PropType<'dark' | 'light'>,
      required: true,
    },
  },
  data() {
    return {
      socket: null as Socket | null,
      message: '',
      selectedUserId: null as string | null,
      isSidebarVisible: false,
      isFriendsListVisible: false,
      friends_list: [
      ] as Friends_list[],
      users: [] as User_messages[],
      // messages: [] as ChatMessage[]
    };
  },
  computed: {
    selectedUser(): User_messages | null {
      return this.users.find((user) => user.id === this.selectedUserId) || null;
    },
    selectedUserMessages(): ChatMessage[] {
      if (this.selectedUserId !== null) {
        const selectedUserMessagesList: User_messages = this.users.filter(user =>
          user.id === this.selectedUserId
        )[0];

        return selectedUserMessagesList.messages;
      }

      return [];

      // return this.messages.filter(msg => 
      //     msg.sender_id === this.selectedUserId || msg.receiver_id === this.selectedUserId
      // );
    },
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },
  created() {
    this.connectSocket();
  },
  mounted() {
    this.getMessages();
    this.getFriendsList();
  },
  beforeUnmount() {
    this.socket?.disconnect();
  },
  methods: {
    connectSocket() {
      this.socket = io('http://localhost:3000');

      this.socket.on('connect', () => {
        console.log('Socket connected');
        if (this.user?.user_id) {
          this.socket?.emit('register', this.user.user_id);
        }
      });

      this.socket.on('private message', this.handleIncomingMessage);
    },
    handleIncomingMessage(data: ChatMessage) {
      // this.messages.push(data);
      if (data.sender_id) {
        this.addMessageToUser(data.sender_id, data, { name: data.sender_username });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer as HTMLDivElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    selectUser(userId: string) {
      this.selectedUserId = userId;
      if (window.innerWidth <= 768) {
        this.isSidebarVisible = false;
      }
      this.$nextTick(this.scrollToBottom);
    },
    async sendMessage() {
      if (!this.message.trim() || !this.socket || !this.user) return;

      const messageData = {
        sender_id: this.user.user_id,
        sender_username: this.user.username,
        receiver_id: this.selectedUserId,
        receiver_username: this.selectedUser?.name,
        message: this.message,
        timestamp: new Date(),
        status: 'read',
      };

      // manda messaggio tramite socket al server
      this.socket.emit('private message', messageData);

      // this.messages.push({ ...messageData, status: "sent" });

      if (this.selectedUserId) {
        this.addMessageToUser(this.selectedUserId, {
          sender_id: this.user.user_id,
          sender_username: this.user.username,
          receiver_id: this.selectedUserId,
          receiver_username: this.selectedUser?.name,
          message: this.message,
          timestamp: new Date(),
          status: 'sent',
        }, { name: "" });
      }

      this.message = '';
      this.sortUsersByLastMessage();
      this.$nextTick(this.scrollToBottom);
    },
    async getMessages() {
      try {
        const results = await axios.get('/api/messages');
        results.data.forEach(this.processIncomingMessage);
        this.sortUsersByLastMessage();
      } catch (error) {
        console.error('Errore:', error);
      }
    },
    async getFriendsList() {
      try {
        const results = await axios.get('/api/friends');
        results.data.forEach((single_friend: Friends_list) => this.friends_list.push(single_friend));
      } catch (error) {
        console.error('Errore:', error);
      }
    },
    processIncomingMessage(element: Messages) {
      const userId = element.sender_id === this.user?.user_id ? element.receiver_id : element.sender_id;
      const senderIsMe = element.sender_id === this.user?.user_id;

      if (userId) {
        this.addMessageToUser(userId, {
          sender_id: element.sender_id,
          sender_username: element.sender_username,
          receiver_id: element.receiver_id,
          receiver_username: element.receiver_username,
          message: element.content,
          timestamp: element.timestamp,
          status: element.status
        }, {
          name: senderIsMe ? element.receiver_username : element.sender_username,
        });

        // Aggiungi il messaggio alla lista `messages`
        // this.messages.push({
        //   sender_id: element.sender_id,
        //   sender_username: element.sender_username,
        //   receiver_id: element.receiver_id,
        //   receiver_username: element.receiver_username,
        //   message: element.content,
        //   timestamp: element.timestamp,
        //   status: element.status
        // });
      }

      // console.log(this.messages);
    },
    addMessageToUser(userId: string, message: ChatMessage, userMetadata: { name?: string }) {
      const userIndex = this.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        this.users[userIndex].messages.push(message);
        this.updateLastMessage(userIndex, message);
      } else {
        this.createNewUser(userId, message, userMetadata);
      }
    },
    updateLastMessage(userIndex: number, message: ChatMessage) {
      this.users[userIndex].lastMessage = message.message;
      const currentTimestamp = this.users[userIndex].lastMessageTimestamp;
      if (!currentTimestamp || new Date(message.timestamp) > new Date(currentTimestamp)) {
        this.users[userIndex].lastMessageTimestamp = message.timestamp;
      }
    },
    createNewUser(userId: string, message: ChatMessage, userMetadata: { name?: string }) {
      this.users.push({
        id: userId,
        name: userMetadata.name || 'Unknown',
        lastMessage: message.message,
        lastMessageTimestamp: message.timestamp,
        messages: [message],
      });
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    toggleFriendsList() {
      this.isFriendsListVisible = !this.isFriendsListVisible;
    },
    startNewChat(friend: Friends_list) {
      if (!this.users.some((user) => user.id === friend.user_id)) {
        this.users.push({
          id: friend.user_id,
          name: friend.username,
          lastMessage: '',
          lastMessageTimestamp: null,
          messages: [],
        });
      }
      this.selectedUserId = friend.user_id;
      this.isFriendsListVisible = false;
    },
    sortUsersByLastMessage() {
      this.users.sort((a, b) => {
        if (a.lastMessageTimestamp === null && b.lastMessageTimestamp === null) {
          return 0;
        }
        if (a.lastMessageTimestamp === null) {
          return -1;
        }
        if (b.lastMessageTimestamp === null) {
          return 1;
        }
        return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime();
      });
    },
  },
});
</script>

<template>
  <section class="chat-app">
    <!-- Sidebar -->
    <aside :class="['chat-sidebar', { visible: isSidebarVisible }, `${mode}-mode`]">
      <header class="sidebar-header" :class="`${mode}-mode`">
        <h2>Chats</h2>
        <button class="add-chat-button" @click="toggleFriendsList">+</button>
      </header>

      <!-- Dropdown per selezionare un amico -->
      <div v-if="isFriendsListVisible" class="friends-dropdown" :class="`${mode}-mode`">
        <ul>
          <li v-for="(friend, index) in friends_list" :key="index" @click="startNewChat(friend)" :class="`${mode}-mode`">
            {{ friend.username }}
          </li>
        </ul>
      </div>

      <nav>
        <ul>
          <li v-for="(user, index) in users" :key="index" @click="selectUser(user.id)"
            :class="{ 'active-user': selectedUserId === user.id, [mode + '-mode']: true }">
            <header class="user-name">{{ user.name }}</header>
            <p class="last-message">{{ user.lastMessage }}</p>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Chat Window -->
    <main class="chat-window" :class="`${mode}-mode`">
      <!-- Chat Header -->
      <header class="chat-header" :class="`${mode}-mode`">
        <button class="menu-button" @click="toggleSidebar">☰</button>
        {{ selectedUser?.name || 'Select a chat' }}
      </header>

      <!-- Chat Messages -->
      <section class="chat-messages" ref="messageContainer">
        <article v-for="(msg, index) in selectedUserMessages" :key="index" :class="[
          {
            'sent-message': msg.sender_id === user?.user_id,
            'received-message': msg.sender_id !== user?.user_id,
          },
          mode + '-mode',
        ]">
          {{ msg.message }}
        </article>
      </section>

      <!-- Message Input -->
      <footer v-if="selectedUser" class="message-input" :class="`${mode}-mode`">
        <input v-model="message" type="text" placeholder="Type a message" :class="`${mode}-mode`" required />
        <button @click="sendMessage" :class="`${mode}-mode`">Send</button>
      </footer>
    </main>
  </section>
</template>

<style lang="scss">
@use '../styles/chat.scss';
</style>