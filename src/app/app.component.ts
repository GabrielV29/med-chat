import { Component } from '@angular/core';
import { ChatService, Conversation } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(public chatService: ChatService){}

  get conversations(): Conversation[]{
    return this.chatService.getConversations();
  }

  get activeId(): string | null {
    return this.chatService['activeConversationId'];
  }

  onCreate(){
    this.chatService.createConversation();
  }

  onSelect(id: string){
    this.chatService.setActiveConversation(id);
  }

  onRemove(id: string){
    this.chatService.deleteConversation(id);
  }

  onRename(data: { id: string; title: string }){
    const conv = this.chatService.getConversations().find(c => c.id === data.id);

    if (conv){
      conv.title = data.title;
    }
  }
}
