import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../services/chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @Input() conversationId: string | null = null;

  sidebarHidden = false;
  userMessage: string = '';
  messages: {from: 'user' | 'bot', text: string }[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient){}

  toggleSidebar(){
    this.sidebarHidden = !this.sidebarHidden;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['conversationId']){
      this.loadConversation(this.conversationId);
    }
  }

  loadConversation(id: string | null){
    // Si no hay id, iniciamos una conversación vacía
    if(!id){
      this.messages = [];
      return;
    }

    const raw = localStorage.getItem(`conversation_${id}`);
    this.messages = raw ? JSON.parse(raw) : [];
  }

  saveConversation(){
    if (!this.conversationId) return;
    localStorage.setItem(`conversation_${this.conversationId}`, JSON.stringify(this.messages));
  }

  send(){
    if(!this.userMessage.trim()) return;

    const messageToSend = this.userMessage;

    //Agregar mensaje del ususario al historial
    this.messages.push({ from: 'user', text: messageToSend});

    // Guarda inmediatamente en localStorage (si hay id)
    this.saveConversation();

    //Limpiar input
    this.userMessage ='';
    this.loading = true;

    this.http.post<any>('http://127.0.0.1:8000/chat', {text: messageToSend}).subscribe({
      next: (response: any) => {
        // Evita error de tipo response es un object genérico
        const replyText = (response && (response.reply || response.text || response.message)) ?? 'No hubo respuesta.';
        this.messages.push({ from: 'bot', text: response.reply });
        // guardar historico tras respuesta
        this.saveConversation();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
        this.messages.push({ from: 'bot', text: 'Error: no se pudo obtener respuesta.'});
        this.saveConversation();
        this.loading = false;
      }
    });
  }
}
