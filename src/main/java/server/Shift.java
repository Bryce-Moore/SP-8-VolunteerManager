package server;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class Shift {
/*example shift object for responses:
Shift {
  shift_id: string;
  date: string; // The format in the POST req is YYYY-MM-DD
  startTime: string; // The format in the POST req is HH:MM AM/PM
  endTime: string;
  totalTime: string;
  status: 'Approved' | 'Denied' | 'Pending';
  email: string; // Email address of user who submitted shift. Not necessary in all instances
}*/
	private String id;
	private LocalDate date;
	private LocalTime startTime;
	private LocalTime endTime;
	private String status;
	private String userId;
	private String groupId;
	
	public Shift(String date, String startTime, String endTime, String userId, String groupId) {
		this.id=ServerMain.d.cache.generateShiftID();
		
		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

        this.date = LocalDate.parse(date, dateFormatter);
        this.startTime = LocalTime.parse(startTime, timeFormatter);
        this.endTime = LocalTime.parse(endTime, timeFormatter);
        status="Pending";
        this.userId=userId;
        this.groupId=groupId;
	}
	
	   public String getShiftID() {
	        return id;
	    }
	   public String getUserId() {
		   return userId;
	   }
	   public String getGroupId() {
		   return groupId;
	   }

	    public String getDate() {
	        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        return date.format(dateFormatter);
	    }

	    public String getStartTime() {
	        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
	        return startTime.format(timeFormatter);
	    }

	    public String getEndTime() {
	        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
	        return endTime.format(timeFormatter);
	    }
	    
	    public String getTotalTime() {
	        Duration duration = Duration.between(startTime, endTime);
	        long hours = duration.toHours();
	        long minutes = duration.toMinutes()%60;
	        return String.format("%02d:%02d", hours, minutes);
	    }
	    public String getStatus() {
	    	return status;
	    }
	    public void updateStatus(String status) {
	    	this.status=status;
	    }
}
