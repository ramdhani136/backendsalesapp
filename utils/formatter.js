const phoneNumberFormatter = (number) => {
  // menghilangkan karakter selain angka
  let formatted = number.replace(/\D/g, "");
  //   menghilangkan angka 0 didepan dan di ganti dengan 62
  if (formatted.startsWith("0")) {
    formatted = "62" + formatted.substr(1);
  }

  if (!formatted.endsWith("@c.us")) {
    formatted += "@c.us";
  }

  if (!formatted.startsWith("62")) {
    formatted = "62" + formatted;
  }

  return formatted;
};

module.exports = { phoneNumberFormatter };
