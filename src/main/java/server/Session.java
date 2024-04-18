package server;

public class Session {
	private String token;
	private String userId;
	public Session(String userId, String token) {
		this.token=token;
		this.userId=userId;
		Util.log("Session created for userID "+userId);
	}
	public String getToken() {
		return token;
	}
	public User getUser() {
		return ServerMain.d.cache.getUserByID(userId);
	}
}
