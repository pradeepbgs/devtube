export const getTimeElapsed = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentTime = new Date();
  
    // Ensure createdDate is valid
    if (isNaN(createdDate.getTime())) {
      return "Unable to determine time elapsed.";
    }
  
    // Calculate time difference in milliseconds
    const timeDifference = currentTime.getTime() - createdDate.getTime();
  
    // Convert to desired units (seconds, minutes, hours, or days)
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    // Choose the most appropriate unit based on magnitude
    let unit;
    if (days > 0) {
      unit = days + (days > 1 ? " days" : " day");
    } else if (hours > 0) {
      unit = hours + (hours > 1 ? " hours" : " hour");
    } else if (minutes > 0) {
      unit = minutes + (minutes > 1 ? " minutes" : " minute");
    } else {
      unit = seconds + (seconds > 1 ? " seconds" : " second");
    }
  
    return unit;
  };