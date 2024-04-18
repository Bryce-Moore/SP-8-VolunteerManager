package server;

import java.time.ZonedDateTime;

public class Group {
	private String groupId;
	private String name;
	private String description;
	private String createdAt,updatedAt;
	
	public Group(String name, String description) {
		this.groupId=ServerMain.d.cache.generateGroupID();
		this.name=name;
		this.description=description;
		createdAt=ZonedDateTime.now().toString();
		updatedAt=ZonedDateTime.now().toString();
		Util.log("Group Created with ID of "+groupId);
	}

	public String getGroupID() {
		// TODO Auto-generated method stub
		return groupId;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public String getUpdatedAt() {
		return updatedAt;
	}
	
}
