import { sendEmail } from "@netlify/emails";

const handler = async (event) => {

  await sendEmail({
    from: "info@geshov.ru",
    to: "vladimir.plesco@gmail.com",
    subject: "Для Володи Плешко",
    template: "test",
  });

  return { statusCode: 200 }

}

module.exports = { handler }
