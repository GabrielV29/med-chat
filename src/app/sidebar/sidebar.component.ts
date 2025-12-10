import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {

  conversations: {id: string, title: string}[] = [];
  selectedId: string | null = null;

  sidebarVisible = true;

  @Output() loadConversation = new EventEmitter<string>();
  @Output() newConversation = new EventEmitter<string>();
  @Output() deleteConversation = new EventEmitter<string>();

  ngOnInit(){
    this.loadFromStorage();
  }

  toggleSidebar(){
    this.sidebarVisible = !this.sidebarVisible;
  }

  loadFromStorage(){
    const data = localStorage.getItem('conversations');
    this.conversations = data ? JSON.parse(data) : [];
  }

  saveToStorage(){
    localStorage.setItem('conversations', JSON.stringify(this.conversations));
  }

  handleNewConversation(){
    const id = Date.now().toString();
    const newConv = {id, title: `Conversación ${this.conversations.length + 1}`};
    this.conversations.push(newConv);
    this.saveToStorage();
    this.newConversation.emit(id);
  }

  handleLoadConversation(id: string){
    this.selectedId = id;
    this.loadConversation.emit(id);
  }

  handleDeleteConversation(id: string){
    this.conversations = this.conversations.filter(conv => conv.id !== id);
    this.saveToStorage();
    this.deleteConversation.emit(id);
  }
}
