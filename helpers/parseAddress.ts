//@ TODO remove

const parseAddress = (fullAddress: string | undefined) => {
  if (!fullAddress) return { houseNumber: "", address: "", postcode: "" };

  const addressParts = fullAddress.split(",").map((part) => part.trim());
  const firstPart = addressParts[0]?.split(" ");

  if (!firstPart || firstPart.length < 2) {
    return { houseNumber: "", address: fullAddress, postcode: "" };
  }

  const houseNumber = firstPart[0];
  const streetName = firstPart.slice(1).join(" ");
  const postcode =
    addressParts.length > 1 ? addressParts[addressParts.length - 1] : "";

  return { houseNumber, address: streetName, postcode };
};

export default parseAddress;
