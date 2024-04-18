package server;

import java.time.ZonedDateTime;

public class User {
	private String email;
	private String hashPass;
	private String accountID;
	private String firstName,lastName;
	private String sq1, sq2;
	private String phone;
	private String createdAt,updatedAt;
	
	
	public User(String email, String pass, String first, String last, String sq1, String sq2,String phone) {
		this.email = email;
		hashPass=Util.getHash(pass);
		accountID=ServerMain.d.cache.generateAccountID();
		firstName = first;
		lastName = last; 
		this.sq1=sq1;
		this.sq2=sq2;
		this.phone=phone;
		createdAt=ZonedDateTime.now().toString();
		updatedAt=ZonedDateTime.now().toString();
		Util.log("User Created with ID of "+accountID);
	}

	public String getEmail() {
		return email;
	}
	public String getPasshash() {
		return hashPass;
	}
	public String getAccountID() {
		return accountID;
	}
	public String getFirstName() {
		return firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public String getPhone() {
		return lastName;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public String getUpdatedAt() {
		return updatedAt;
	}
}
