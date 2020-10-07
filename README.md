Zest Mail
=================

Zest Mail is single page application to send mails. This application is using `sendgrid` to send mail.
Current version is deployed at [https://zest-mail.glitch.me/](https://zest-mail.glitch.me/)


Applicaiton is doing following things
  1. Using - https://zest-mail.glitch.me/
  - User can send mail to desired recipient using this page
  - User can see preview of mail on this page
  - Mail body can be text or HTML

  2. Using - https://zest-mail.glitch.me/image
  - This page is generating random images
  - If used this path inside Email, Email will display random images to different users, or different image when mail is forwarded to another account
  - Gmail is caching images of their server, Yahoo is remving cache after around 9hrs
    
    

Required Environment config
------
```
# Environment Config

# store your secrets and config variables in here
# only invited collaborators will be able to see your .env values

# reference these in your code with process.env.SECRET

SENDGRID_API_KEY=<<SendGrid API Key>>
UNSPLASH_API_KEY=<<UnSplash API Key>>
SENDER_MAIL=<<Sender Email Configured using SendGrid>>
```



Made with [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
