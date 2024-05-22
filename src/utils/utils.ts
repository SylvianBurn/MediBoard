const formatDate = (dateString: string): string => {
  const date = new Date(dateString); // Create a Date object from the input string
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(); // Format the date as "DD/MM/YYYY"
};

export default formatDate;