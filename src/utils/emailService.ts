// utils/emailService.ts
import emailjs from 'emailjs-com';

export const sendEmail = (to: string, subject: string, templateParams: any) => {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      to_email: to,
      from_name: 'AirGlobe',
      reply_to: 'support@airglobe.com',
      ...templateParams,
    },
    process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
  ).then((response) => {
    console.log('Email sent successfully:', response);
  }).catch((error) => {
    console.error('Error sending email:', error);
  });
};
