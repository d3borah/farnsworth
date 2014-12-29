/**
 * Created by Fathalian on 12/25/14.
 */

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('N8kOumk9RDHqce0bichZNQ');
var paymentTemplateName = 'premiumemail';
var waitingListTemplateName = 'premiumemail-copy-01'

function sendTemplateEmail(userInfo, templateName, callback) {

    //these are pretty much useless but the API demands it
    var template_content = [{
        "name": "example name",
        "content": "example content"
    }];
    var paymentMessage = {
        to: [
            {
                email: userInfo.userEmail,
                name: userInfo.userName
            }
        ],
        headers: {
            "Reply-To": "team@zyring.com"
        },
        bcc_address: "team@zyring.com",
        track_opens: true,
        track_clicks: true,
        merge_vars: [
            {
                rcpt: userInfo.userEmail,
                vars: [
                    {
                        name: 'FNAME',
                        content: userInfo.userName
                    },
                    {
                        name: 'TRACKNAME',
                        content: userInfo.userTrack
                    },
                    {
                        name: 'TRACKID',
                        content: userInfo.trackId
                    }
                ]
            }
        ],
        tags: [
            templateName
        ]
    };
    mandrill_client.messages.sendTemplate({
            "template_name": templateName,
            "template_content" : template_content,
            "message": paymentMessage,
            "async": false
        },
        function (result) {
            callback(null, result);
        }, function (err) {
            callback(err);
        });
}

function sendPaymentSuccessEmail(userInfo, callback) {
    sendTemplateEmail(userInfo, paymentTemplateName, callback);
};

function sendWaitingListEmail(userInfo, callback) {
    sendTemplateEmail(userInfo, waitingListTemplateName, callback);
}

module.exports = {
    sendPaymentSuccessEmail: sendPaymentSuccessEmail,
    sendWaitingListEmail : sendWaitingListEmail

};
