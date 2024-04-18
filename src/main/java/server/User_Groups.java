package server;

import java.time.ZonedDateTime;

public class User_Groups {
	private String userId;
	private String groupId;
	private String role;
	private String joinedAt;
	
	
	public User_Groups(String userId, String groupId,String role) {
		this.userId = userId;
		this.groupId=groupId;
		this.role=role;
		joinedAt=ZonedDateTime.now().toString();

		Util.log("User ("+userId+") Assigned to group "+groupId+" as role: "+role);
	}

	public String getUserId() {
		return userId;
	}
	public String getGroupId() {
		return groupId;
	}
	public String getRole() {
		return role;
	}
	public String getJoinedAt() {
		return joinedAt;
	}

}
