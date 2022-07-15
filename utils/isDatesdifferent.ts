import getDate from "./getDate";

export default (currDate, prevDate) => {
    return (
      getDate(prevDate.createdAt.seconds).format("MM:DD:YYYY") !==
      getDate(currDate.createdAt.seconds).format("MM:DD:YYYY")
    );
  };