import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidebarVisible = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // id de la conversación seleccionada (o null para nueva)
  currentConversationId: string | null = null;

  // Cuando el sidebar emite loadCOnversation(id)
  onLoadConversation(id: string){
    this.currentConversationId = id;
  }

  // Cuando el sidebar emite newConversation()
  // Auí recuperamos la lista desde localStorage y seleccionamos la última conversación
  onNewConversation(id?: string){
    if (id) {
      // Cuando el sidebar envía un ID explícito:
      this.currentConversationId = id;
      return;
    }

    // Fallback si no llega ningún ID: crear una nueva conversación
    const raw = localStorage.getItem('conversations');
    const list = raw ? JSON.parse(raw) as {id: string, title: string}[] : [];

    const newId = Date.now().toString();
    const newTitle = `Conversación ${list.length + 1}`;

    list.push({ id: newId, title: newTitle});
    localStorage.setItem('conversations', JSON.stringify(list));

    this.currentConversationId = newId;
  }

  // Cuando el sidebar emite deleteConversation(id)
  onDeleteConversation(id: string){
    // Si la conversación borrada es la que está activa, limpiamos el chat
    if (this.currentConversationId === id){
      this.currentConversationId = null;
    }
  }
}
