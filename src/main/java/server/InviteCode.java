package server;

public class InviteCode {
	
	private String inviteCode;
	private String groupID;
	
	public InviteCode(String groupID) {
		this.groupID=groupID;

		this.inviteCode=Util.tokenGeneration(10);
		}
	
	public String getInviteCode() {
		return inviteCode;
	}
	public String getGroupID() {
		return groupID;
	}
	
}
