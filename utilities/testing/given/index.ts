// import { Alarm } from "./alarm.tsp";
// import { User } from "./user";

class GivenUtility {
  
	private constructor() {}
	static readonly instance = new GivenUtility();
	
	// readonly user = User;
	// readonly alarm = Alarm;

}

export const Given = GivenUtility.instance;