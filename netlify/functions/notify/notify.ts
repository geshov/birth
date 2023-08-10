import { sendEmail } from "@netlify/emails";

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {

  await sendEmail({
    from: "info@geshov.ru",
    to: "geshov@gmail.com",
    subject: "Уведомление о ДР",
    template: "notice",
  });

  return { statusCode: 200 };

};

export { handler };
