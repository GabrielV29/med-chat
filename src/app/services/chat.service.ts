import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation{
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private conversations: Conversation[] = [];
  private activeConversationId: string | null = null;

  constructor (private http: HttpClient){
    this.loadFromStorage();
  }

  /** Conversaciones */

  createConversation(){
    const newId = crypto.randomUUID();
    const conversation: Conversation = {
      id: newId,
      title: 'Nueva conversación',
      messages: [],
      createdAt: Date.now()
    };

    this.conversations.push(conversation);
    this.activeConversationId = newId;
    this.saveToStorage();
  }

  getConversations(){
    return this.conversations;
  }

  deleteConversation(id: string){
    this.conversations = this.conversations.filter(c => c.id !== id);

    if (this.activeConversationId === id){
      this.activeConversationId = null;
    }

    this.saveToStorage();
  }

  setActiveConversation(id: string){
    this.activeConversationId = id;
    this.saveToStorage();
  }

  get activeConversation(): Conversation | undefined{
    return this.conversations.find(c => c.id === this.activeConversationId);
  }

  /** Manejo de mensajes */

  addUserMessage(content: string){
    if(!this.activeConversation) this.createConversation();

    this.activeConversation!.messages.push({
      role: 'user',
      content
    });
    this.saveToStorage();
  }

  addAssistantMessage(content: string){
    if (!this.activeConversation) this.createConversation();

    this.activeConversation!.messages.push({
      role: 'assistant',
      content
    });

    this.saveToStorage();
  }

  getHistory(): Message[]{
    return this.activeConversation?.messages ?? [];
  }

  /** Enviar al backend */

  sendMessage(message: string): Observable<any>{
    this.addUserMessage(message);

    const body = {
      messages: this.activeConversation!.messages
    };

    return this.http.post('https://med-chat-backend-1.onrender.com', body);
  }

  /** LocalStorage */

  private saveToStorage(){
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
    localStorage.setItem('activeConversationId', this.activeConversationId ?? '');
  }

  private loadFromStorage(){
    const stored = localStorage.getItem('conversations');
    const active = localStorage.getItem('activeConversationId');

    if (stored){
      this.conversations = JSON.parse(stored);
    }

    if (active){
      this.activeConversationId = active;
    }
  }
}
