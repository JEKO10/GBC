const formatPhoneNumber = (phone: string | undefined) => {
  if (!phone) return phone;

  return phone.replace(/\s+/g, "").replace(/-/g, " ");
};

export default formatPhoneNumber;
