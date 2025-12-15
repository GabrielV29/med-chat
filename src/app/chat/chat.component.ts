import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userMessage: string = "";
  messages: { from: 'user' | 'assistant', text: string }[] = [];
  loading: boolean = false;

  constructor(private chatService: ChatService){}

  ngOnInit(){
    // Recupera el historial de conversación si existe
    const history = this.chatService.getHistory();
    this.messages = history.map(m => ({ from: m.role === 'user' ? 'user' : 'assistant', text: m.content}));
    setTimeout(() => this.scrollToBottom());
  }

  send(event?: Event){
    if (event) event.preventDefault();
    const text = this.userMessage?.trim();
    if (!text) return;

    this.userMessage = "";
    this.loading = true;

    this.chatService.sendMessage(text).subscribe({
      next: (res: any) => {
        const reply = res?.reply ?? res?.message ?? 'No hay respuesta';

        this.messages.push({from: 'user', text});
        this.messages.push({from: 'assistant', text: reply});

        this.chatService.addAssistantMessage(reply);
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          from: 'assistant',
          text: '❌ No se puso conectar con el servidor.'
        });
        this.loading = false;
      }
    });
  }

  private scrollToBottom(){
    try{
      setTimeout(() =>{
        if(this.scrollContainer){
          this.scrollContainer.nativeElement.scrollTo({
            top: this.scrollContainer.nativeElement.scrollHeight, behavior: 'smooth'
          })
        }
      }, 50);
    } catch (err){}
  }
}
