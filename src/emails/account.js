const sgmail=require('@sendgrid/mail')


sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgmail.send({
        to:email,
        from:"adwaitnsk.2009@rediffmail.com",
        subject:'thanks for joining',
        text:`welcome to app, ${name}.let me know how you get along`
    })
}

const sendCancellation=(email,name)=>{
    sgmail.send({
        to:email,
        from:"adwaitnsk.2009@rediffmail.com",
        subject:'good journey together',
        text:`hey , ${name}.let me know how was your journey`
    })
}


module.exports={
    sendWelcomeEmail,
    sendCancellation
}