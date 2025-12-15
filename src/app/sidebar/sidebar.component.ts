import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conversation } from '../services/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {

  // INPUTS
  @Input() conversations: Conversation[] = [];
  @Input() selectedId: string | null = null;

  // OUTPUTS
  @Output() create = new EventEmitter<void>();
  @Output() select = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();
  @Output() rename = new EventEmitter<{id: string, title: string}>();

  sidebarVisible = true;
  editingId: string | null = null;
  tempTitle = "";

  toggleSidebar(){
    this.sidebarVisible = !this.sidebarVisible;
  }

  startRename(conv: Conversation){
    this.editingId = conv.id;
    this.tempTitle = conv.title;
  }

  confirmRename(id: string){
    if (this.tempTitle.trim()){
      this.rename.emit({ id, title: this.tempTitle.trim() })
    }
    this.editingId = null;
  }
}
