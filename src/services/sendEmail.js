// import nodeoutlook from 'nodejs-nodemailer-outlook'
// export function confirmEmail(dest,subject,message,attachments=[]){
//      nodeoutlook.sendEmail({
//         auth: {
//             user:process.env.senderEmail,
//             pass: process.env.senderPassword
//         },
//         from: process.env.senderEmail,
//         to: dest,
//         subject,
//         html: message,
//         attachments,
//         onError: (e) => console.log(e),
//         onSuccess: (i) => console.log(i)
//     }
    
    
//     );
// }

import nodemailer from 'nodemailer'
export async function sendEmail(dest, subject, message , attachments=[]) {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.nodeMailerEmail, // generated ethereal user
            pass: process.env.nodeMailerPassword, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Route" < ${process.env.nodeMailerEmail}>`, // sender address
        to: dest, // list of receivers
        subject, // Subject line
        html: message, // html body
        attachments
    });
    console.log(info);
    return info
}

