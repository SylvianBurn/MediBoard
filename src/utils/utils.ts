const formatDate = (dateString: string): string => {
  const date = new Date(dateString); // Create a Date object from the input string
  const newDate = date.getDate() + "/" + Number(date.getMonth() + 1) + "/" + date.getFullYear();

  return newDate; // Format the date as "DD/MM/YYYY"
};

export default formatDate;