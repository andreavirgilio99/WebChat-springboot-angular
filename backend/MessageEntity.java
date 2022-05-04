package com.example.model;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity(name="Message")
@Table(name = "MESSAGES")
public class MessageEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ms_id")
	private long ms_id;
	
	@Column(name = "chat_id")
	private long chat_id;
	
	@Column(name = "sender")
	private String sender;
	
	@Column(name = "t_stamp")
	private String t_stamp;
	
	@Column(name = "content")
	private String content;
	
	public MessageEntity() {}

	public MessageEntity(String sender, String t_stamp, String content, Long chat_id) {
		this.sender = sender;
		this.t_stamp = t_stamp;
		this.content = content;
		this.chat_id = chat_id;
	}

	public long getMs_id() {
		return ms_id;
	}

	public void setMs_id(Long ms_id) {
		this.ms_id = ms_id;
	}

	public long getChat_id() {
		return chat_id;
	}

	public void setChat_id(Long chat_id) {
		this.chat_id = chat_id;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getT_stamp() {
		return t_stamp;
	}

	public void setT_stamp(String t_stamp) {
		this.t_stamp = t_stamp;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	
}
