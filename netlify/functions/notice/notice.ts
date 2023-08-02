import { sendEmail } from "@netlify/emails";

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {

  await sendEmail({
    from: "info@geshov.ru",
    to: "vladimir.plesco@gmail.com",
    subject: "Для Володи Плешко",
    template: "test",
  });

  return { statusCode: 200 };

};

export { handler };
