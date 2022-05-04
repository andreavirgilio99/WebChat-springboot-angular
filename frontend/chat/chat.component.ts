import { Component, ElementRef, OnInit, AfterViewChecked} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../user.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { FormControl } from '@angular/forms';
import { Messaggio } from '../model/messaggio';
import { HttpClient } from '@angular/common/http';
import { Observable,  of } from 'rxjs';

@Component({
  selector: 'app-chat-',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit,AfterViewChecked{
  url = 'http://localhost:8080';
  otherUser?: User;
  thisUser: User = JSON.parse(sessionStorage.getItem('user')!);
  channelName?: string;
  socket?: WebSocket;
  stompClient?: Stomp.Client;
  newMessage = new FormControl('');
  messages?: Observable<Array<Messaggio>>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http:HttpClient,
    private el: ElementRef) {}


  ngOnInit(): void {
    this.userService
      .getUserByNickname(this.route.snapshot.paramMap.get('user')!)
      .subscribe((data) => {
        this.otherUser = data;
        this.otherUser.propic = "data:image/jpeg;base64,"+ this.otherUser.propic;
        this.connectToChat();
        console.log(this.el)
        this.el.nativeElement.querySelector("#chat").scrollIntoView();
      });
  }

  ngAfterViewChecked(): void {
    this.scrollDown();
  }

  scrollDown(){
    var container = this.el.nativeElement.querySelector("#chat");
    container.scrollTop = container.scrollHeight;
  }

  connectToChat() {
    const id1 = this.thisUser.id!;
    const nick1 = this.thisUser.nickname;
    const id2 = this.otherUser?.id!;
    const nick2 = this.otherUser?.nickname!;

    if (id1 > id2) {
      this.channelName = nick1 + '&' + nick2;
    } else {
      this.channelName = nick2 + '&' + nick1;
    }
    this.loadChat();
    console.log('connecting to chat...');
    this.socket = new SockJS(this.url + '/chat');
    this.stompClient = Stomp.over(this.socket);

    this.stompClient.connect({}, (frame) => {
      //func = what to do when connection is established
      console.log('connected to: ' + frame);
      this.stompClient!.subscribe(
        '/topic/messages/' + this.channelName,
        (response) => {
          //func = what to do when client receives data (messages)
          this.loadChat();
        }
      );
    });
  }

  sendMsg() {
    if (this.newMessage.value !== '') {
      this.stompClient!.send(
        '/app/chat/' + this.channelName,
        {},
        JSON.stringify({
          sender: this.thisUser.nickname,
          t_stamp: 'to be defined in server',
          content: this.newMessage.value,
        })
      );
      this.newMessage.setValue('');
    }
  }

  loadChat(){
    this.messages = this.http.post<Array<Messaggio>>(this.url+'/getMessages' ,  this.channelName);
    this.messages.subscribe(data => {
      let mgs:Array<Messaggio> = data;
      mgs.sort((a, b) => (a.ms_id > b.ms_id) ? 1 : -1)
      this.messages = of(mgs);
    })
    console.log(this.messages);
  }

  whenWasItPublished(myTimeStamp: string) {
    const endDate = myTimeStamp.indexOf('-');
    return (
      myTimeStamp.substring(0, endDate) +
      ' at ' +
      myTimeStamp.substring(endDate + 1)
    );
  }

}
