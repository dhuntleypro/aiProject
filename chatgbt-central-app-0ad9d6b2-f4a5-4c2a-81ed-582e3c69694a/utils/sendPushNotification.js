const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.REGION_NAME,
});

const mySnsArn = process.env.MY_CUSTOMER_SNS;
const sns = new AWS.SNS();


 


function sendPushNotification(body, title) {
  const messageParams = {
    Message: JSON.stringify({
      default: "Default message",
      APNS: JSON.stringify({
        aps: {
          alert: {
            title: "title test",
            body: "body......",
          },
          sound: "default",
          badge: 1
        }
      }),
      APNS_SANDBOX: JSON.stringify({
        aps: {
          alert: {
            title: "title test",
            body: "body......",
          },
          sound: "default",
          badge: 1
        }
      })
    }),
    MessageStructure: 'json',
    TargetArn: mySnsArn
  };

  sns.publish(messageParams, function (err, data) {
    if (err) {
      console.error("Error sending message:", err);
    } else {
      console.log("Message sent successfully");
    }
  });
}



 module.exports.sendPushNotification = sendPushNotification;



